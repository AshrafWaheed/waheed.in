{{-- Bulletproof-ish button: a table cell with a padded anchor, because
     button elements and CSS padding on <a> are unreliable in Outlook. --}}
<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 24px;">
  <tr>
    <td style="background:{{ $bg ?? '#254851' }};border-radius:4px;">
      <a href="{{ $url }}"
         style="display:inline-block;padding:13px 26px;font-family:Arial,Helvetica,sans-serif;font-size:13px;font-weight:bold;letter-spacing:.05em;color:{{ $fg ?? '#FFFFFF' }};text-decoration:none;">
        {{ $label }}
      </a>
    </td>
  </tr>
</table>
