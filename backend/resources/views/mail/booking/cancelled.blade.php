@component('mail.booking.layout', ['eyebrow' => 'Call cancelled', 'title' => 'Your call has been cancelled', 'preheader' => 'No hard feelings — book another time whenever suits.'])

<p style="margin:0 0 18px;font-family:Georgia,'Times New Roman',serif;font-size:22px;line-height:1.3;color:#254851;">
  That&rsquo;s cancelled.
</p>

<p style="margin:0 0 22px;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.65;color:#4a5a5e;">
  We&rsquo;ve released the time below and removed it from both calendars. Nothing further is needed
  from you.
</p>

@include('mail.booking.when', ['label' => 'Was booked for', 'tone' => '#F5F7FA'])

<p style="margin:0 0 24px;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.65;color:#4a5a5e;">
  If the timing was the only problem, we&rsquo;d still be glad to talk.
</p>

@include('mail.booking.button', ['url' => $bookUrl, 'label' => 'Book another time'])

@endcomponent
