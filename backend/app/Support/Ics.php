<?php

namespace App\Support;

use App\Models\Booking;

/**
 * Builds an .ics attachment for a booking.
 *
 * Google already emails its own invitation to the attendee, so this is
 * belt-and-braces for the people that invitation does not reach: Outlook users
 * whose employer strips Google invites, anyone who booked with a work address
 * that silently rejects external calendar mail, and everyone who deletes the
 * Google one and later wants it back from our confirmation.
 *
 * Two details that quietly break calendar clients if you get them wrong:
 *
 *   · UID must be STABLE across the confirmation, any reschedule and the
 *     cancellation. A fresh UID each time means a reschedule shows up as a
 *     second event rather than replacing the first, and the cancellation
 *     cancels nothing.
 *   · SEQUENCE must INCREASE on every update, or clients treat the newer file
 *     as a duplicate of the one they already have and ignore it.
 */
class Ics
{
    /**
     * @param  'REQUEST'|'CANCEL'  $method  REQUEST adds/updates, CANCEL removes
     */
    public static function forBooking(Booking $booking, string $method = 'REQUEST'): string
    {
        $type = $booking->bookingType;
        $organiser = config('mail.from.address');

        // Every reschedule bumps updated_at, so seconds-since-creation rises
        // monotonically without needing a column of its own.
        //
        // `absolute: true` is load-bearing, not defensive: Carbon 3's
        // diffInSeconds is SIGNED and returns a float, so the obvious spelling
        // yields something like -300.0 — and a negative SEQUENCE is invalid
        // under RFC 5545, which clients are entitled to reject the whole event
        // over. The cast to int matters for the same reason: "SEQUENCE:300.0"
        // is not an integer either.
        $sequence = $booking->created_at && $booking->updated_at
            ? (int) $booking->created_at->diffInSeconds($booking->updated_at, absolute: true)
            : 0;

        $description = trim(implode('\\n', array_filter([
            $type?->name,
            $booking->meet_url ? 'Join: '.$booking->meet_url : null,
            '',
            'Change or cancel: '.url('/book/manage/'.$booking->manage_token),
        ])));

        $lines = [
            'BEGIN:VCALENDAR',
            'VERSION:2.0',
            'PRODID:-//WAHEED//Booking//EN',
            'CALSCALE:GREGORIAN',
            'METHOD:'.$method,
            'BEGIN:VEVENT',
            'UID:booking-'.$booking->uid.'@waheed.in',
            'SEQUENCE:'.($method === 'CANCEL' ? $sequence + 1 : $sequence),
            'DTSTAMP:'.now()->utc()->format('Ymd\THis\Z'),
            'DTSTART:'.$booking->starts_at->utc()->format('Ymd\THis\Z'),
            'DTEND:'.$booking->ends_at->utc()->format('Ymd\THis\Z'),
            'SUMMARY:'.self::esc(($type?->name ?? 'Call').' · WAHEED'),
            'DESCRIPTION:'.self::esc($description),
            $booking->meet_url ? 'LOCATION:'.self::esc($booking->meet_url) : 'LOCATION:Online',
            'ORGANIZER;CN=WAHEED:mailto:'.$organiser,
            'ATTENDEE;CN='.self::esc($booking->name).';RSVP=FALSE:mailto:'.$booking->email,
            'STATUS:'.($method === 'CANCEL' ? 'CANCELLED' : 'CONFIRMED'),
            'END:VEVENT',
            'END:VCALENDAR',
        ];

        // RFC 5545 wants CRLF line endings; some clients are strict about it.
        return implode("\r\n", array_filter($lines))."\r\n";
    }

    /** Escape per RFC 5545: backslash, semicolon, comma and newlines. */
    private static function esc(string $value): string
    {
        return str_replace(
            ['\\', ';', ',', "\r\n", "\n"],
            ['\\\\', '\\;', '\\,', '\\n', '\\n'],
            $value,
        );
    }
}
