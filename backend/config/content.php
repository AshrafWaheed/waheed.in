<?php

/**
 * Content engine configuration. See documents/CONTENT_ENGINE.md.
 *
 * Every value here is a security or cost control, not a preference. Read §4 of
 * that document before widening `allowed_tools` or pointing `cwd` at anything
 * that contains application code.
 */
return [

    // Master switch. Off until an API key exists and the feature is reviewed.
    'enabled' => env('CONTENT_ENGINE_ENABLED', false),

    'claude' => [
        'binary' => env('CLAUDE_BINARY', '/home/dev/.local/bin/claude'),
        'model' => env('CONTENT_MODEL', 'claude-opus-5'),

        /*
         * Auth mode. Two options, and the choice is a real tradeoff.
         *
         * bare = true  → `--bare`. Auth is strictly ANTHROPIC_API_KEY; OAuth and
         *   the keychain are never read. Nothing expires, nothing needs a
         *   browser, and the run is fully isolated. Costs a separate API bill.
         *
         * bare = false → `--safe-mode` instead, and the CLI uses the interactive
         *   login already on this machine (~/.claude/.credentials.json), i.e.
         *   the existing Claude subscription. No separate billing.
         *   Caveat: OAuth refresh tokens hard-expire rather than sliding with
         *   use, so this WILL eventually fail with a 401 and need someone to run
         *   `claude` interactively again. Anthropic's own CLI guidance points
         *   servers at API keys or Workload Identity Federation for this reason.
         *   Treat it as fine for supervised use, not for unattended cron.
         *
         * --safe-mode is what keeps this honest either way: it disables CLAUDE.md
         * discovery, skills, plugins, hooks, MCP servers and custom agents, so a
         * generation is not silently shaped by whatever is installed that week.
         * Without it, all 105 installed plugin skills would load into every call.
         */
        'bare' => env('CONTENT_BARE_MODE', false),
        'api_key' => env('ANTHROPIC_API_KEY'),

        /*
         * HOME for the child process. In subscription mode this must be the real
         * home so the CLI can read its credentials; in bare mode it is pointed at
         * the scratch parent so the process sees nothing of the user's account.
         * Note the agent itself cannot read files in either mode — allowed_tools
         * grants no Read or Bash — so the tool allowlist, not HOME, is the
         * boundary that matters.
         */
        'home' => env('CONTENT_HOME', '/home/dev'),

        /*
         * THE SECURITY BOUNDARY. The generator fetches pages we do not control,
         * on a box that also runs MySQL and holds .env. Indirect prompt
         * injection via a fetched page is the realistic attack, so the agent
         * gets research tools and nothing else. Do not add Bash, Read, Write or
         * Edit here. See CONTENT_ENGINE.md §4.2.
         */
        'allowed_tools' => ['WebSearch', 'WebFetch'],

        // Fails closed: an unexpected tool request is denied, not executed.
        'permission_mode' => 'manual',

        // An empty directory. Never the repository.
        'cwd' => env('CONTENT_SCRATCH_DIR', '/srv/contentbot/scratch'),

        'brand_voice_file' => env('CONTENT_BRAND_VOICE', '/srv/contentbot/BRAND_VOICE.md'),
        'schema_dir' => env('CONTENT_SCHEMA_DIR', '/srv/contentbot/schemas'),

        /*
         * Optional OS-user separation (CONTENT_ENGINE.md §4.2 layer 3). Null
         * runs as the web/queue user. Setting this requires a second `claude`
         * install owned by that user plus a NOPASSWD sudoers rule scoped to the
         * binary — see the deployment note in CONTENT_ENGINE.md.
         */
        'run_as' => env('CONTENT_RUN_AS'),

        // Research turns legitimately take minutes. Queue timeout must exceed this.
        'timeout' => (int) env('CONTENT_TIMEOUT', 600),
    ],

    'prompts' => [
        // Bumped whenever the generator instructions change materially, so a
        // quality shift can be traced to a specific version.
        'draft_version' => 'gen-v3',
    ],

    'limits' => [
        'max_turns_per_draft' => (int) env('CONTENT_MAX_TURNS', 40),
        'monthly_budget_usd' => (float) env('CONTENT_MONTHLY_BUDGET', 50),
    ],

    // Opus 5 list price, per million tokens. Used for cost attribution only.
    'pricing' => [
        'input_per_mtok' => 5.00,
        'output_per_mtok' => 25.00,
    ],
];
