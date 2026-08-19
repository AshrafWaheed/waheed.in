<?php

namespace App\Services\Content;

use App\Models\GenerationRun;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use RuntimeException;
use Symfony\Component\Process\Exception\ProcessTimedOutException;
use Symfony\Component\Process\Process;

/**
 * The only place in this application that starts a `claude -p` process.
 *
 * Everything security-relevant about the content engine lives here, so there is
 * exactly one thing to audit. See documents/CONTENT_ENGINE.md §4.
 *
 * Two rules that must never be relaxed:
 *
 *   1. Arguments are an ARRAY. Symfony\Process escapes each element, so a topic
 *      of `"; rm -rf /var/www; #` is passed to claude as a literal string
 *      instead of being interpreted by a shell. Never introduce shell_exec,
 *      exec, system, passthru, proc_open-with-a-string, or backticks here.
 *
 *   2. The user's prompt goes on STDIN, never argv. Prompts are long, contain
 *      newlines and quotes, and are the least trustworthy input in the system.
 *      argv is also world-readable via /proc on a shared box.
 *
 * The tool allowlist is the other half. The agent fetches pages nobody here
 * controls, so a fetched page is a plausible injection vector; with only
 * WebSearch and WebFetch available, the worst outcome of a successful injection
 * is a bad draft a human then declines to publish.
 */
class ClaudeRunner
{
    /** Tokens that must never appear in a rendered prompt. Belt and braces. */
    private const FORBIDDEN_IN_PROMPT = ["\0"];

    public function __construct(private VoiceCompiler $voice) {}

    /**
     * Run one turn.
     *
     * @param  string       $prompt     User/system text, passed on stdin.
     * @param  string|null  $sessionId  UUID. Null starts a fresh session.
     * @param  bool         $resume     Continue $sessionId rather than create it.
     * @param  bool         $fork       With $resume: branch to a new session id.
     * @param  string|null  $schema     Filename in the schema dir, e.g. blog_draft.json
     * @param  bool         $holdout    Run without the learned style rules (§7 control).
     * @return array{json: array|null, raw: string, session_id: string, usage: array, duration_ms: int}
     */
    public function run(
        string $prompt,
        ?string $sessionId = null,
        bool $resume = false,
        bool $fork = false,
        ?string $schema = null,
        ?int $postId = null,
        string $stage = 'draft',
        ?int $userId = null,
        bool $holdout = false,
    ): array {
        $cfg = config('content.claude');

        if (! config('content.enabled')) {
            throw new RuntimeException('Content engine is disabled (CONTENT_ENGINE_ENABLED).');
        }
        if ($cfg['bare'] && blank($cfg['api_key'])) {
            throw new RuntimeException(
                'ANTHROPIC_API_KEY is not set. `claude --bare` reads auth only from that '.
                'variable — it never falls back to an interactive login. Either add the key '.
                'to backend/.env, or set CONTENT_BARE_MODE=false to use the interactive '.
                'login already on this machine.'
            );
        }
        if (! $cfg['bare'] && ! is_file(rtrim($cfg['home'], '/').'/.claude/.credentials.json')) {
            throw new RuntimeException(
                'Subscription mode is on but no interactive login was found at '.
                $cfg['home'].'/.claude/.credentials.json. Run `claude` once as that user to '.
                'log in, or switch to CONTENT_BARE_MODE=true with an API key.'
            );
        }
        foreach (self::FORBIDDEN_IN_PROMPT as $bad) {
            if (str_contains($prompt, $bad)) {
                throw new RuntimeException('Prompt contains a forbidden control character.');
            }
        }

        $sessionId ??= (string) Str::uuid();
        $rulesetVersion = $holdout ? 0 : $this->voice->version();
        $args = $this->buildArgs($cfg, $sessionId, $resume, $fork, $schema, $holdout);

        // run_as is off by default; it needs its own claude install (§4.2 layer 3).
        if (filled($cfg['run_as'])) {
            $args = ['sudo', '-n', '-u', $cfg['run_as'], '--', ...$args];
        }

        $process = new Process(
            $args,
            $cfg['cwd'],
            $this->environment($cfg),
            $prompt,          // stdin — never argv
            $cfg['timeout'],
        );

        $startedAt = microtime(true);
        $timedOut = false;

        try {
            $process->run();
        } catch (ProcessTimedOutException) {
            $timedOut = true;
        }

        $durationMs = (int) round((microtime(true) - $startedAt) * 1000);
        $stdout = $process->getOutput();
        $stderr = $process->getErrorOutput();
        $exitCode = $timedOut ? -1 : (int) $process->getExitCode();

        $parsed = $this->parse($stdout);

        GenerationRun::create([
            'post_id' => $postId,
            'stage' => $stage,
            'session_id' => $parsed['session_id'] ?? $sessionId,
            'prompt_version' => config('content.prompts.draft_version'),
            'ruleset_version' => $rulesetVersion,
            'model_id' => $cfg['model'],
            'input_tokens' => $parsed['usage']['input_tokens'] ?? null,
            'output_tokens' => $parsed['usage']['output_tokens'] ?? null,
            'cost_usd' => $this->cost($parsed['usage'] ?? [], $parsed['cost'] ?? null),
            'duration_ms' => $durationMs,
            'exit_code' => $exitCode,
            'stderr_excerpt' => Str::limit($stderr, 2000),
            'user_id' => $userId,
        ]);

        if ($timedOut) {
            // The session survives on disk, so --resume still works.
            throw new RuntimeException(
                "Generation timed out after {$cfg['timeout']}s. Session {$sessionId} is resumable."
            );
        }

        $this->reportDenials($parsed['denials'] ?? [], $sessionId, $postId);

        if ($exitCode !== 0 || ($parsed['is_error'] ?? false)) {
            Log::warning('claude -p failed', [
                'exit' => $exitCode, 'session' => $sessionId, 'stderr' => Str::limit($stderr, 500),
            ]);
            throw new RuntimeException('Generation failed: '.Str::limit($stderr ?: 'no error output', 300));
        }

        return [
            'json' => $parsed['json'],
            'raw' => $parsed['text'],
            'session_id' => $parsed['session_id'] ?? $sessionId,
            'usage' => $parsed['usage'] ?? [],
            'duration_ms' => $durationMs,
        ];
    }

    /** @return list<string> */
    private function buildArgs(
        array $cfg,
        string $sessionId,
        bool $resume,
        bool $fork,
        ?string $schema,
        bool $holdout,
    ): array {
        /*
         * The system-prompt path is resolved HERE, from the compiler, and is
         * never accepted from a caller. --append-system-prompt-file reads a file
         * off this box and puts its contents into the model's context, and the
         * model has WebFetch, so a caller-supplied path is a file-read primitive
         * with an exfiltration route attached. Pointing it at backend/.env would
         * be enough. The only two possible values are the base voice file and
         * the compiled one, both under the contentbot directory.
         */
        $voiceFile = $this->voice->fileFor($holdout);

        $args = [
            $cfg['binary'],
            '-p',
            /*
             * Isolation. Both flags strip ambient context so a run cannot be
             * silently reshaped by whatever is installed on the box that week —
             * without this, all 105 installed plugin skills load into every call.
             * They differ only in auth: --bare demands an API key, --safe-mode
             * lets the CLI use the interactive login already on this machine.
             * See config/content.php → claude.bare.
             */
            $cfg['bare'] ? '--bare' : '--safe-mode',
            '--model', $cfg['model'],
            '--permission-mode', $cfg['permission_mode'],
            '--allowedTools', implode(' ', $cfg['allowed_tools']),
            '--append-system-prompt-file', $voiceFile,
            '--output-format', 'json',
        ];

        if ($resume) {
            $args[] = '--resume';
            $args[] = $sessionId;
            if ($fork) {
                $args[] = '--fork-session';
            }
        } else {
            $args[] = '--session-id';
            $args[] = $sessionId;
        }

        if ($schema !== null) {
            // basename() so a caller can never traverse out of the schema dir.
            $path = rtrim($cfg['schema_dir'], '/').'/'.basename($schema);
            if (! is_file($path)) {
                throw new RuntimeException("Schema not found: {$path}");
            }
            // --json-schema takes the schema document itself, not a path to it.
            // Passing it on argv is safe: this is our own file, never user input,
            // and it is a few KB against a megabyte-scale ARG_MAX.
            $json = file_get_contents($path);
            if ($json === false || json_decode($json) === null) {
                throw new RuntimeException("Schema is unreadable or not valid JSON: {$path}");
            }
            $args[] = '--json-schema';
            $args[] = $json;
        }

        return $args;
    }

    /**
     * A deliberately tiny environment. The child inherits nothing from the web
     * process, so DB credentials and app secrets are simply absent from it.
     */
    private function environment(array $cfg): array
    {
        $env = [
            // In subscription mode HOME must be the real home so the CLI can find
            // its credentials; in bare mode it is deliberately somewhere empty.
            'HOME' => $cfg['bare'] ? dirname($cfg['cwd']) : rtrim($cfg['home'], '/'),
            'PATH' => '/usr/local/bin:/usr/bin:/bin:'.rtrim($cfg['home'], '/').'/.local/bin',
            'LANG' => 'C.UTF-8',
        ];

        if ($cfg['bare']) {
            $env['ANTHROPIC_API_KEY'] = $cfg['api_key'];
        }

        // Note what is NOT here: no DB_*, no APP_KEY, no MAIL_*, nothing from the
        // Laravel environment. The child inherits an explicit list, not the parent
        // process environment, so application secrets are simply absent from it.
        return $env;
    }

    /**
     * `--output-format json` returns an envelope carrying the result text plus
     * session and usage metadata. With --json-schema the result is the schema'd
     * object; without it, prose.
     */
    private function parse(string $stdout): array
    {
        $envelope = json_decode(trim($stdout), true);

        if (! is_array($envelope)) {
            return ['json' => null, 'text' => $stdout, 'session_id' => null, 'usage' => [],
                'cost' => null, 'is_error' => false, 'denials' => []];
        }

        $result = $envelope['result'] ?? $envelope['content'] ?? null;

        // The result may itself be a JSON string when a schema was applied.
        $json = is_array($result) ? $result : (is_string($result) ? json_decode($result, true) : null);

        return [
            'json' => is_array($json) ? $json : null,
            'text' => is_string($result) ? $result : $stdout,
            'session_id' => $envelope['session_id'] ?? null,
            'usage' => $envelope['usage'] ?? [],
            // The CLI prices the turn itself, including cache reads and writes,
            // which a naive tokens-times-rate calculation gets badly wrong.
            'cost' => isset($envelope['total_cost_usd']) ? (float) $envelope['total_cost_usd'] : null,
            'is_error' => (bool) ($envelope['is_error'] ?? false),
            'denials' => $envelope['permission_denials'] ?? [],
        ];
    }

    /**
     * A denial means the agent tried to use a tool outside the allowlist.
     *
     * Nothing legitimate in this pipeline does that — the generator is asked to
     * search and write, and it has been given exactly those tools. So a denial
     * is the signature of prompt injection, most plausibly from a page fetched
     * during research. The attempt was blocked (that is what the allowlist is
     * for), but it means someone is trying, and that should be loud.
     */
    private function reportDenials(array $denials, string $sessionId, ?int $postId): void
    {
        if ($denials === []) {
            return;
        }

        Log::warning('content-engine: blocked tool use — possible prompt injection', [
            'session' => $sessionId,
            'post_id' => $postId,
            'denials' => array_slice($denials, 0, 10),
        ]);
    }

    /** Prefer the CLI's own figure; fall back to list price if it is absent. */
    private function cost(array $usage, ?float $reported): ?float
    {
        if ($reported !== null) {
            return round($reported, 6);
        }

        $in = $usage['input_tokens'] ?? null;
        $out = $usage['output_tokens'] ?? null;
        if ($in === null && $out === null) {
            return null;
        }

        $p = config('content.pricing');

        return round(
            ($in ?? 0) / 1_000_000 * $p['input_per_mtok']
            + ($out ?? 0) / 1_000_000 * $p['output_per_mtok'],
            6
        );
    }
}
