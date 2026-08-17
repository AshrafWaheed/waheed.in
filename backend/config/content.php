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

    /*
     * Public site root, used to build the canonical URL every syndicated variant
     * points back at. Read here rather than via env() at call time so it keeps
     * working under `config:cache`, where env() returns null.
     */
    'site_url' => rtrim(env('FRONTEND_URL', 'https://waheed.in'), '/'),

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
        'variant_version' => 'var-v1',
    ],

    /*
     * Syndication targets (CONTENT_ENGINE.md §2 P7, §6 stage 6).
     *
     * A variant is a DIFFERENT PIECE arguing from the same research, not the
     * blog post reformatted. That is the whole design: reprinting the article
     * on four sites creates four near-duplicates competing with the original,
     * and canonical tags are a request rather than a guarantee. Writing a
     * genuinely different angle that links back removes the problem at source
     * instead of papering over it, and is better for the reader besides.
     *
     * `angle` is the standing brief for how this platform's piece should differ.
     * `max_chars` is a hard ceiling the generator is held to and the UI checks.
     * `publish` records reality, not ambition:
     *   api    — a real publishing API exists (Blogger v3)
     *   manual — no usable API. Medium closed new integration tokens in 2023;
     *            Substack has never had a publishing API; LinkedIn article
     *            posting is not in the public API. These are copy-paste, and
     *            pretending otherwise would just build a broken button.
     */
    'platforms' => [
        'linkedin' => [
            'label' => 'LinkedIn',
            'format' => 'text',
            'max_chars' => 3000,
            'publish' => 'manual',
            'angle' => 'A first-person practitioner note. One specific thing you have seen '
                .'go wrong for a Muslim business owner, what it cost them, and the single '
                .'decision that avoids it. No listicle, no "in today\'s digital landscape". '
                .'Opens with the concrete situation, not a thesis. Ends by pointing at the '
                .'full article for the reasoning and the sources.',
        ],
        'medium' => [
            'label' => 'Medium',
            'format' => 'html',
            'max_chars' => 12000,
            'publish' => 'manual',
            'angle' => 'The essay the blog post could not be, because the blog post has to '
                .'answer a search query. Take one idea from the article and argue it '
                .'properly for a general technical readership who may not be Muslim: what '
                .'the constraint actually is, why it produces better work rather than '
                .'worse, what a non-Muslim reader can take from it.',
        ],
        'substack' => [
            'label' => 'Substack',
            'format' => 'html',
            'max_chars' => 9000,
            'publish' => 'manual',
            'angle' => 'A letter to people who already know us. Warmer, more direct, allowed '
                .'to be opinionated and to reference what we are working on. Assumes the '
                .'reader trusts us and wants the judgement, not the 101.',
        ],
        'blogger' => [
            'label' => 'Blogger',
            'format' => 'html',
            'max_chars' => 9000,
            'publish' => 'api',
            'angle' => 'A practical walkthrough aimed squarely at the beginner the main '
                .'article assumes past: define the terms, work one worked example end to '
                .'end, and keep the fiqh light. Where the article rules, this one shows.',
        ],
        'tumblr' => [
            'label' => 'Tumblr',
            'format' => 'html',
            'max_chars' => 4000,
            'publish' => 'api',
            'angle' => 'Short, punchy, one argument. Written for people who scroll. A strong '
                .'opening claim, three or four tight paragraphs of support, done.',
        ],
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
