@component('mail.booking.layout', ['eyebrow' => 'Tomorrow', 'title' => 'Your call is tomorrow', 'preheader' => 'A short reminder, and the link to join.'])

<p style="margin:0 0 18px;font-family:Georgia,'Times New Roman',serif;font-size:22px;line-height:1.3;color:#254851;">
  Speaking tomorrow.
</p>

<p style="margin:0 0 22px;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.65;color:#4a5a5e;">
  A quick reminder of your call &mdash; nothing to prepare, and no slides at our end either.
</p>

@include('mail.booking.when', ['label' => 'Tomorrow'])

@if ($booking->meet_url)
  @include('mail.booking.button', ['url' => $booking->meet_url, 'label' => 'Join the Google Meet'])
@endif

<p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:1.65;color:#4a5a5e;">
  If tomorrow no longer works, you can
  <a href="{{ $manageUrl }}" style="color:#9c7d1c;">move or cancel it</a> &mdash; far better than a
  no-show for either of us.
</p>

@endcomponent
