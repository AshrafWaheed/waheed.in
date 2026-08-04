<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * The booking module — "book a call" on the public site, backed by a real
 * Google Calendar event with a Google Meet link.
 *
 * Six tables, in dependency order:
 *
 *   booking_types              what can be booked (v1 ships one: a 30-min call)
 *   booking_availability_rules the recurring weekly windows
 *   booking_date_overrides     holidays and one-off changes to those windows
 *   bookings                   the appointments themselves
 *   booking_events             append-only audit trail per booking
 *   google_accounts            the single connected Google account's tokens
 *
 * EVERYTHING IS STORED IN UTC. The business timezone lives in one place only —
 * the `booking_timezone` key in `settings` — and the visitor's timezone is
 * recorded per booking so a confirmation can be rendered in their local time.
 * The one exception is `booking_availability_rules` / `booking_date_overrides`,
 * whose TIME columns are wall-clock times in the BUSINESS timezone: "I work
 * 10:00–13:00" has to survive a DST shift in the visitor's country, which a
 * stored UTC instant would not.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('booking_types', function (Blueprint $table) {
            $table->id();
            $table->string('slug')->unique();
            $table->string('name');
            $table->text('description')->nullable();

            $table->unsignedSmallInteger('duration_min')->default(30);
            // Dead time held around the meeting so calls never touch back-to-back.
            $table->unsignedSmallInteger('buffer_before')->default(0);
            $table->unsignedSmallInteger('buffer_after')->default(10);
            // How soon someone may book ("not within 4 hours") and how far out.
            $table->unsignedInteger('min_notice_min')->default(240);
            $table->unsignedSmallInteger('horizon_days')->default(30);
            // Null = unlimited calls per day.
            $table->unsignedTinyInteger('daily_cap')->nullable();

            $table->string('location')->default('meet'); // meet | phone | in_person
            $table->boolean('is_active')->default(true);
            $table->unsignedSmallInteger('sort')->default(0);
            $table->timestamps();
        });

        // Recurring weekly availability. Multiple rows per weekday are expected —
        // a split day ("10:00–13:00 and 16:00–18:30") is two rows, not one row
        // with a hole in it.
        Schema::create('booking_availability_rules', function (Blueprint $table) {
            $table->id();
            // Null = applies to every booking type. Set only to give one type
            // its own hours.
            $table->foreignId('booking_type_id')->nullable()->constrained()->cascadeOnDelete();
            $table->unsignedTinyInteger('weekday'); // 0 = Sunday … 6 = Saturday
            $table->time('start_time');
            $table->time('end_time');
            $table->boolean('is_active')->default(true);
            $table->timestamps();

            $table->index(['weekday', 'is_active']);
        });

        // Exceptions to the weekly rules, keyed by calendar date.
        //   is_closed = true   → the whole day is blocked, times ignored
        //   is_closed = false  → this row REPLACES the weekly windows for that
        //                        date; several rows give several windows.
        Schema::create('booking_date_overrides', function (Blueprint $table) {
            $table->id();
            $table->date('date');
            $table->boolean('is_closed')->default(true);
            $table->time('start_time')->nullable();
            $table->time('end_time')->nullable();
            $table->string('note')->nullable(); // "Eid", "travelling"
            $table->timestamps();

            $table->index('date');
        });

        Schema::create('bookings', function (Blueprint $table) {
            $table->id();
            // Public reference (ULID). Shown to the visitor; never expose the id.
            $table->ulid('uid')->unique();
            $table->foreignId('booking_type_id')->constrained()->restrictOnDelete();

            $table->string('name');
            $table->string('email');
            $table->string('phone')->nullable();
            $table->string('company')->nullable();
            $table->text('message')->nullable();

            $table->dateTime('starts_at'); // UTC
            $table->dateTime('ends_at');   // UTC
            $table->string('visitor_tz')->default('UTC');

            // confirmed | cancelled | completed | no_show
            $table->string('status')->default('confirmed');

            /*
             * THE DOUBLE-BOOKING GUARD.
             *
             * Holds "{booking_type_id}:{starts_at}" while the booking is live and
             * is set to NULL the moment it is cancelled. MySQL unique indexes
             * ignore NULLs, so a cancelled row releases its slot automatically
             * and a concurrent second insert for a taken slot fails at the
             * database rather than at whichever request happened to be slower.
             * Do not "clean this up" into a plain composite unique on
             * (booking_type_id, starts_at) — that would keep cancelled bookings
             * holding their slots forever.
             */
            $table->string('slot_lock')->nullable()->unique();

            $table->string('google_event_id')->nullable();
            $table->string('google_html_link')->nullable();
            $table->string('meet_url')->nullable();
            $table->string('calendar_status')->nullable(); // synced | failed | skipped

            // Bearer of the "manage your booking" link in the confirmation email.
            // Random, not derived from anything — it is the only credential on
            // the reschedule/cancel page.
            $table->string('manage_token', 64)->unique();

            $table->string('source')->default('web');
            $table->string('hubspot_status')->nullable(); // synced | failed | skipped
            $table->text('admin_note')->nullable();

            $table->timestamp('reminder_sent_at')->nullable();
            $table->timestamp('cancelled_at')->nullable();
            $table->string('cancelled_by')->nullable(); // visitor | admin
            $table->timestamps();

            $table->index(['status', 'starts_at']);
            $table->index('starts_at');
            $table->index('email');
        });

        /*
         * Append-only history. One row per thing that happened to a booking —
         * this is what the admin console's detail drawer renders as a timeline,
         * and it is the only record of whether an email actually went out.
         * Rows are never updated or deleted, so there is no `updated_at`.
         */
        Schema::create('booking_events', function (Blueprint $table) {
            $table->id();
            $table->foreignId('booking_id')->constrained()->cascadeOnDelete();
            // created | rescheduled | cancelled | completed | no_show
            // mail_sent | mail_failed | reminder_sent
            // calendar_synced | calendar_failed | hubspot_synced | hubspot_failed
            $table->string('kind');
            $table->json('meta')->nullable();
            $table->timestamp('created_at')->useCurrent();

            $table->index(['booking_id', 'created_at']);
        });

        /*
         * The connected Google account. Exactly one row in practice, but kept as
         * a table rather than settings keys because the tokens need `encrypted`
         * casts and an expiry timestamp the refresh logic can compare against.
         */
        Schema::create('google_accounts', function (Blueprint $table) {
            $table->id();
            $table->string('email')->nullable();
            // Encrypted at the model layer — the column is text because
            // ciphertext is far longer than the token it wraps.
            $table->text('access_token')->nullable();
            $table->text('refresh_token')->nullable();
            $table->timestamp('expires_at')->nullable();
            $table->text('scopes')->nullable();
            $table->string('calendar_id')->default('primary');
            $table->timestamp('connected_at')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('google_accounts');
        Schema::dropIfExists('booking_events');
        Schema::dropIfExists('bookings');
        Schema::dropIfExists('booking_date_overrides');
        Schema::dropIfExists('booking_availability_rules');
        Schema::dropIfExists('booking_types');
    }
};
