@component('mail.booking.layout', ['eyebrow' => 'Your call is booked', 'title' => 'Your call is booked', 'preheader' => 'A Google Meet link and a way to change the time, if you need it.'])

<p style="margin:0 0 18px;font-family:Georgia,'Times New Roman',serif;font-size:22px;line-height:1.3;color:#254851;">
  You&rsquo;re booked, {{ Str::before($booking->name, ' ') }}.
</p>

<p style="margin:0 0 22px;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.65;color:#4a5a5e;">
  Thank you for making the time. Here are the details &mdash; a calendar file is attached, so you can
  add it wherever you keep your diary.
</p>

@include('mail.booking.when')

@if ($booking->meet_url)
  @include('mail.booking.button', ['url' => $booking->meet_url, 'label' => 'Join the Google Meet'])
  <p style="margin:-10px 0 24px;font-family:Arial,Helvetica,sans-serif;font-size:13px;line-height:1.6;color:#8b9a9e;">
    The same link is on the calendar invitation, so you don&rsquo;t need to keep this email to hand.
  </p>
@else
  <p style="margin:0 0 24px;font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:1.65;color:#4a5a5e;">
    We&rsquo;ll send your meeting link shortly. If it hasn&rsquo;t arrived within the hour, reply to this
    email and we&rsquo;ll sort it out.
  </p>
@endif

@if ($booking->message)
  <p style="margin:0 0 8px;font-family:Arial,Helvetica,sans-serif;font-size:11px;letter-spacing:.09em;text-transform:uppercase;color:#8b9a9e;">
    What you told us
  </p>
  <p style="margin:0 0 24px;padding:14px 16px;background:#F5F7FA;border-radius:8px;font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:1.6;color:#4a5a5e;">
    {{ $booking->message }}
  </p>
@endif

<p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:1.65;color:#4a5a5e;">
  Something come up? You can
  <a href="{{ $manageUrl }}" style="color:#9c7d1c;">move or cancel the call</a>
  yourself &mdash; no need to ask.
</p>

@endcomponent
