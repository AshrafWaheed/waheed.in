{{--
  Shared shell for every booking email.

  Table-based with inline styles on purpose: Outlook's Word renderer ignores
  most of a <style> block, and float/flex/grid are simply unavailable. What
  looks like 2005 HTML here is the only thing that survives the range of
  clients these emails land in.

  Brand colours are hardcoded rather than pulled from CSS variables, which no
  mail client supports:  teal #254851 · gold #9c7d1c · bloom #fff3b0 ·
  ivory #F5F7FA.
--}}
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>{{ $title ?? 'WAHEED' }}</title>
</head>
<body style="margin:0;padding:0;background:#F5F7FA;">
  {{-- Preheader: the grey line clients show after the subject. Hidden in body. --}}
  @isset($preheader)
    <div style="display:none;max-height:0;overflow:hidden;opacity:0;">{{ $preheader }}</div>
  @endisset

  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#F5F7FA;">
    <tr>
      <td align="center" style="padding:32px 16px;">

        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"
               style="max-width:560px;background:#FFFFFF;border-radius:12px;overflow:hidden;">

          {{-- header --}}
          <tr>
            <td style="background:#254851;padding:26px 32px;">
              <p style="margin:0;font-family:Georgia,'Times New Roman',serif;font-size:20px;letter-spacing:.14em;color:#FFFFFF;">
                WAHEED
              </p>
              <p style="margin:4px 0 0;font-family:Arial,Helvetica,sans-serif;font-size:11px;letter-spacing:.1em;text-transform:uppercase;color:#9fb8bd;">
                {{ $eyebrow ?? 'Digital Studio' }}
              </p>
            </td>
          </tr>

          {{-- body --}}
          <tr>
            <td style="padding:32px;">
              {{ $slot }}
            </td>
          </tr>

          {{-- footer --}}
          <tr>
            <td style="padding:20px 32px 26px;border-top:1px solid #E9EDF2;">
              <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:12px;line-height:1.6;color:#8b9a9e;">
                WAHEED · <a href="{{ url('/') }}" style="color:#9c7d1c;text-decoration:none;">waheed.in</a><br>
                Reply to this email and a person will read it.
              </p>
            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>
</body>
</html>
