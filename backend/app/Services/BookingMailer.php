<?php

namespace App\Services;

use App\Jobs\SendBookingMail;
use App\Mail\BookingMail;
use App\Models\Booking;

/**
 * One place that decides who gets told what.
 *
 * The controllers say "this booking was confirmed"; they do not decide that a
 * confirmation goes to the visitor and a heads-up goes to us, nor that a
 * reminder is visitor-only. Keeping that here means adding a recipient later is
 * one edit rather than a hunt through three controllers.
 *
 * Everything is dispatched, never sent inline — see {@see SendBookingMail} for
 * why that matters to the person waiting on the confirmation screen.
 */
class BookingMailer
{
    public function confirmed(Booking $booking): void
    {
        $this->dispatch($booking, BookingMail::CONFIRMED, both: true);
    }

    public function rescheduled(Booking $booking): void
    {
        $this->dispatch($booking, BookingMail::RESCHEDULED, both: true);
    }

    public function cancelled(Booking $booking): void
    {
        $this->dispatch($booking, BookingMail::CANCELLED, both: true);
    }

    /**
     * Visitor only. We already know about tomorrow's calls — our own calendar
     * is reminding us, and a duplicate would train us to ignore both.
     */
    public function reminder(Booking $booking): void
    {
        $this->dispatch($booking, BookingMail::REMINDER, both: false);
    }

    private function dispatch(Booking $booking, string $kind, bool $both): void
    {
        SendBookingMail::dispatch($booking->id, $kind, 'visitor');

        if ($both) {
            SendBookingMail::dispatch($booking->id, $kind, 'admin');
        }
    }
}
