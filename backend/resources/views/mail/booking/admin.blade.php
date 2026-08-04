@php
  $headline = match ($kind) {
      'rescheduled' => 'A call moved',
      'cancelled'   => 'A call was cancelled',
      default       => 'New call booked',
  };
@endphp

@component('mail.booking.layout', ['eyebrow' => 'Admin', 'title' => $headline, 'preheader' => $booking->name.' — '.$businessWhen])

<p style="margin:0 0 20px;font-family:Georgia,'Times New Roman',serif;font-size:22px;line-height:1.3;color:#254851;">
  {{ $headline }}
</p>

<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"
       style="background:{{ $kind === 'cancelled' ? '#F5F7FA' : '#fff3b0' }};border-radius:10px;margin:0 0 24px;">
  <tr>
    <td style="padding:18px 20px;">
      <p style="margin:0;font-family:Georgia,'Times New Roman',serif;font-size:19px;line-height:1.35;color:#254851;">
        {{ $businessWhen }}
      </p>
      <p style="margin:5px 0 0;font-family:Arial,Helvetica,sans-serif;font-size:13px;color:#6b7c80;">
        {{ $businessTz }}{{ $visitorTz ? ' · ' . $visitorWhen . ' their time (' . $visitorTz . ')' : '' }}
      </p>
    </td>
  </tr>
</table>

{{-- Contact details as a definition list rather than prose: this email gets
     skimmed on a phone thirty seconds before the call starts. --}}
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 22px;">
  @foreach ([
      'Name'    => $booking->name,
      'Email'   => $booking->email,
      'Phone'   => $booking->phone,
      'Company' => $booking->company,
      'Ref'     => $booking->uid,
  ] as $label => $value)
    @if ($value)
      <tr>
        <td width="90" style="padding:5px 0;font-family:Arial,Helvetica,sans-serif;font-size:12px;letter-spacing:.06em;text-transform:uppercase;color:#8b9a9e;vertical-align:top;">
          {{ $label }}
        </td>
        <td style="padding:5px 0;font-family:Arial,Helvetica,sans-serif;font-size:14px;color:#2b3d41;">
          @if ($label === 'Email')
            <a href="mailto:{{ $value }}" style="color:#9c7d1c;">{{ $value }}</a>
          @else
            {{ $value }}
          @endif
        </td>
      </tr>
    @endif
  @endforeach
</table>

@if ($booking->message)
  <p style="margin:0 0 8px;font-family:Arial,Helvetica,sans-serif;font-size:11px;letter-spacing:.09em;text-transform:uppercase;color:#8b9a9e;">
    What they want to talk about
  </p>
  <p style="margin:0 0 24px;padding:14px 16px;background:#F5F7FA;border-radius:8px;font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:1.6;color:#4a5a5e;">
    {{ $booking->message }}
  </p>
@endif

@if ($kind !== 'cancelled' && $booking->meet_url)
  @include('mail.booking.button', ['url' => $booking->meet_url, 'label' => 'Join the Meet'])
@endif

@if ($kind !== 'cancelled' && ! $booking->meet_url)
  <p style="margin:0 0 22px;padding:12px 15px;background:#fdecec;border-radius:8px;font-family:Arial,Helvetica,sans-serif;font-size:13px;line-height:1.6;color:#b0413f;">
    <strong>No Meet link.</strong> This booking did not reach Google Calendar &mdash; open the admin
    panel and use &ldquo;Retry calendar&rdquo;.
  </p>
@endif

<p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:13px;line-height:1.6;color:#8b9a9e;">
  <a href="{{ $adminUrl }}" style="color:#9c7d1c;">Open in the admin panel</a>
</p>

@endcomponent
