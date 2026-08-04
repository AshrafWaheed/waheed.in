@component('mail.booking.layout', ['eyebrow' => 'Your call has moved', 'title' => 'Your call has moved', 'preheader' => 'The new time, and an updated calendar invitation.'])

<p style="margin:0 0 18px;font-family:Georgia,'Times New Roman',serif;font-size:22px;line-height:1.3;color:#254851;">
  That&rsquo;s moved for you.
</p>

<p style="margin:0 0 22px;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.65;color:#4a5a5e;">
  Your call is now at the time below. The attached calendar file replaces the old one, so your diary
  should update itself.
</p>

@include('mail.booking.when', ['label' => 'New time'])

@if ($booking->meet_url)
  @include('mail.booking.button', ['url' => $booking->meet_url, 'label' => 'Join the Google Meet'])
  <p style="margin:-10px 0 24px;font-family:Arial,Helvetica,sans-serif;font-size:13px;line-height:1.6;color:#8b9a9e;">
    The meeting link has not changed.
  </p>
@endif

<p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:1.65;color:#4a5a5e;">
  Need to change it again? <a href="{{ $manageUrl }}" style="color:#9c7d1c;">Here&rsquo;s the link</a>.
</p>

@endcomponent
