<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Third Party Services
    |--------------------------------------------------------------------------
    |
    | This file is for storing the credentials for third party services such
    | as Mailgun, Postmark, AWS and more. This file provides the de facto
    | location for this type of information, allowing packages to have
    | a conventional file to locate the various service credentials.
    |
    */

    'postmark' => [
        'key' => env('POSTMARK_API_KEY'),
    ],

    'resend' => [
        'key' => env('RESEND_API_KEY'),
    ],

    'ses' => [
        'key' => env('AWS_ACCESS_KEY_ID'),
        'secret' => env('AWS_SECRET_ACCESS_KEY'),
        'region' => env('AWS_DEFAULT_REGION', 'us-east-1'),
    ],

    'slack' => [
        'notifications' => [
            'bot_user_oauth_token' => env('SLACK_BOT_USER_OAUTH_TOKEN'),
            'channel' => env('SLACK_BOT_USER_DEFAULT_CHANNEL'),
        ],
    ],

    'beehiiv' => [
        'key' => env('BEEHIIV_API_KEY'),
        'publication_id' => env('BEEHIIV_PUBLICATION_ID'),
    ],

    'booking' => [
        // Where the internal "someone booked a call" notice goes. Defaults to
        // the From address so the module is never silently un-notified.
        'notify_to' => env('BOOKING_NOTIFY_TO', env('MAIL_FROM_ADDRESS')),
        // How long before a call its reminder goes out.
        'reminder_hours' => (int) env('BOOKING_REMINDER_HOURS', 24),
    ],

    /*
     * Google OAuth (web client) for the booking module. Single-tenant: one
     * admin connects one Google account once, and its refresh token drives
     * every calendar call from then on. Visitors never see Google.
     *
     * The redirect URI is registered in the Google Console as
     * https://waheed.in/api/google/auth/callback — which nginx routes to
     * NEXT.JS, not here. Next receives the code and forwards it to
     * /api/admin/google/callback over loopback. Do not "fix" this by pointing
     * the URI at Laravel; :8000 is not publicly reachable.
     *
     * Scopes are requested at authorize time (see GoogleOAuthService::SCOPES),
     * but they must ALSO be listed on the OAuth consent screen, and the Google
     * Calendar API must be enabled on the project, or every call 403s.
     */
    'google' => [
        'client_id' => env('GOOGLE_CLIENT_ID'),
        'client_secret' => env('GOOGLE_CLIENT_SECRET'),
        'redirect' => env('GOOGLE_REDIRECT_URI', 'https://waheed.in/api/google/auth/callback'),
        'calendar_id' => env('GOOGLE_CALENDAR_ID', 'primary'),
    ],

    'hubspot' => [
        // Private App access token. Scopes needed: crm.objects.contacts.write,
        // crm.objects.companies.write, crm.objects.deals.write (+ .read).
        'token' => env('HUBSPOT_ACCESS_TOKEN'),
        // "WAHEED Client Pipeline" and its entry stage (from the live account).
        'pipeline' => env('HUBSPOT_PIPELINE', 'default'),
        'dealstage' => env('HUBSPOT_DEALSTAGE', 'appointmentscheduled'),
    ],

];
