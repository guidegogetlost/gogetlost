// netlify/functions/postcardTemplate.js
function postcardTemplate({
  locationName,
  region,
  activity,
  date,
  recipientName,
  imageUrl
}) {
  const safeName = recipientName || "Explorer";
  const safeRegion = region || "United Kingdom";
  const safeActivity = activity || "A little adventure chosen by LOST";
  const safeDate = date || "";
  const imgBlock = imageUrl
    ? `<img src="${imageUrl}" alt="${locationName}"
             style="width:100%;max-width:600px;border-radius:18px;
                    display:block;margin:0 auto 18px;box-shadow:0 10px 30px rgba(15,23,42,0.3);" />`
    : "";

  return `
  <!doctype html>
  <html>
    <head>
      <meta charset="utf-8" />
      <title>Your LOST postcard</title>
    </head>
    <body style="margin:0;padding:0;background:#0f172a;font-family:system-ui,-apple-system,BlinkMacSystemFont,'SF Pro Text','Segoe UI',sans-serif;">
      <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
        <tr>
          <td align="center" style="padding:24px;">
            <table width="100%" cellpadding="0" cellspacing="0" role="presentation"
                   style="max-width:640px;background:radial-gradient(circle at top,#1e293b,#020617);border-radius:24px;border:1px solid rgba(148,163,184,0.4);overflow:hidden;">
              <tr>
                <td style="padding:20px 22px 10px 22px;">
                  <div style="font-size:11px;letter-spacing:0.18em;text-transform:uppercase;color:#a5b4fc;">
                    We&apos;re getting lost...
                  </div>
                  <h1 style="margin:6px 0 0;font-size:22px;color:#e5e7eb;">
                    ${locationName}
                  </h1>
                  <p style="margin:4px 0 0;font-size:13px;color:#9ca3af;">
                    ${safeRegion}${safeDate ? " · " + safeDate : ""}
                  </p>
                </td>
              </tr>

              <tr>
                <td style="padding:0 22px 16px;">
                  ${imgBlock}
                </td>
              </tr>

              <tr>
                <td style="padding:0 22px 16px;">
                  <p style="margin:0 0 10px;font-size:14px;line-height:1.5;color:#e5e7eb;">
                    Hi ${safeName},
                  </p>
                  <p style="margin:0 0 10px;font-size:14px;line-height:1.5;color:#e5e7eb;">
                    LOST has picked a new place for you to get lost:
                    <strong>${locationName}</strong>.
                  </p>
                  <p style="margin:0 0 10px;font-size:14px;line-height:1.5;color:#cbd5f5;">
                    ${safeActivity}
                  </p>
                  <p style="margin:0;font-size:13px;line-height:1.5;color:#9ca3af;">
                    Open your maps, grab what you need, and head out. The rest is up to you.
                  </p>
                </td>
              </tr>

              <tr>
                <td style="padding:0 22px 20px;">
                  <a href="https://gogetlost.uk"
                     style="display:inline-block;padding:9px 16px;border-radius:999px;
                            background:#e5e7eb;color:#020617;font-size:13px;
                            text-decoration:none;font-weight:600;">
                    Open LOST
                  </a>
                </td>
              </tr>

              <tr>
                <td style="padding:0 22px 18px;border-top:1px solid rgba(51,65,85,0.8);">
                  <p style="margin:10px 0 0;font-size:11px;color:#6b7280;">
                    Sent by LOST · wheretonext@gogetlost.uk · Built by Michael James MacDonald with a little help from AI.
                  </p>
                </td>
              </tr>

            </table>
          </td>
        </tr>
      </table>
    </body>
  </html>
  `;
}

module.exports = { postcardTemplate };
