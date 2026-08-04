{{-- The time card. One partial so a confirmation and its reminder can never
     disagree about how a time is printed. --}}
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"
       style="background:{{ $tone ?? '#fff3b0' }};border-radius:10px;margin:0 0 24px;">
  <tr>
    <td style="padding:18px 20px;">
      <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:11px;letter-spacing:.09em;text-transform:uppercase;color:{{ ($tone ?? null) ? '#6b7c80' : '#8a6f18' }};">
        {{ $label ?? 'Your call' }}
      </p>
      <p style="margin:6px 0 0;font-family:Georgia,'Times New Roman',serif;font-size:19px;line-height:1.35;color:#254851;">
        {{ $when }}
      </p>
      <p style="margin:6px 0 0;font-family:Arial,Helvetica,sans-serif;font-size:13px;color:#6b7c80;">
        {{ $booking->bookingType?->duration_min }} minutes · times shown in {{ $tz }}
      </p>
    </td>
  </tr>
</table>
