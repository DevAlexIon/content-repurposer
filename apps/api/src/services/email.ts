import { Resend } from 'resend'

export async function sendWaitlistEmail(email: string) {
  const resend = new Resend(process.env.RESEND_API_KEY)

  await resend.emails.send({
    from: 'Repurposer <noreply@userepurposer.com>',
    to: email,
    subject: "You're on the waitlist! 🎉",
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background-color:#0f0a1e;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#0f0a1e;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="480" cellpadding="0" cellspacing="0" style="background-color:#1a1035;border-radius:16px;border:1px solid rgba(139,92,246,0.2);overflow:hidden;">
          
          <!-- Header -->
          <tr>
            <td align="center" style="padding:40px 40px 24px;">
              <div style="width:64px;height:64px;background:linear-gradient(135deg,#7c3aed,#a855f7);border-radius:16px;display:inline-block;text-align:center;line-height:64px;font-size:32px;">⚡</div>
            </td>
          </tr>

          <!-- Title -->
          <tr>
            <td align="center" style="padding:0 40px 16px;">
              <h1 style="margin:0;font-size:28px;font-weight:700;color:#ffffff;">You're on the list!</h1>
            </td>
          </tr>

          <!-- Subtitle -->
          <tr>
            <td align="center" style="padding:0 40px 32px;">
              <p style="margin:0;font-size:16px;line-height:1.6;color:rgba(255,255,255,0.6);text-align:center;">
                Thanks for joining the waitlist for <strong style="color:#a855f7;">Content Repurposer AI</strong>.<br>
                We'll email you the moment we launch.
              </p>
            </td>
          </tr>

          <!-- Box -->
          <tr>
            <td style="padding:0 40px 32px;">
              <table width="100%" cellpadding="0" cellspacing="0" style="background:rgba(139,92,246,0.1);border:1px solid rgba(139,92,246,0.25);border-radius:12px;">
                <tr>
                  <td style="padding:20px;text-align:center;">
                    <p style="margin:0;color:rgba(255,255,255,0.85);font-size:14px;line-height:1.6;">
                      🎁 As an early member, you'll get <strong style="color:#ffffff;">3 free repurposings</strong> when we launch + exclusive early access pricing.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td align="center" style="padding:0 40px 24px;">
              <a href="https://userepurposer.com/login" 
                style="display:inline-block;padding:12px 28px;background:linear-gradient(135deg,#7c3aed,#a855f7);color:#fff;border-radius:10px;text-decoration:none;font-weight:700;font-size:15px;">
                Try it now →
              </a>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td align="center" style="padding:0 40px 40px;">
              <p style="margin:0;font-size:12px;color:rgba(255,255,255,0.3);">
              You're receiving this because you signed up at <a href="https://userepurposer.com" style="color:rgba(255,255,255,0.3);">userepurposer.com</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`
  })
}