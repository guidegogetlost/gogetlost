// netlify/functions/postcardTemplate.js

function postcardTemplate({
  locationName,
  region,
  activity,
  date,
  recipientName,
  mapUrl,
}) {
  const safeName = recipientName || "Explorer";
  const safeRegion = region || "United Kingdom";
  const safeDate = date || "";

  return `
  <!doctype html>
  <html>
  <head>
    <meta charset="utf-8" />
    <title>LOST postcard</title>
  </head>
  <body style="margin:0;background:#020617;padding:24px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',system-ui,sans-serif;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0"
           style="max-width:600px;margin:0 auto;background:#020617;border-radius:24px;overflow:hidden;border:1px solid #111827;">
      <tr>
        <td style="padding:16px 24px 8px 24px;color:#e5e7eb;font-size:12px;text-align:center;letter-spacing:0.18em;text-transform:uppercase;">
          LOST logo
        </td>
      </tr>

      <!-- Hero image -->
      <tr>
        <td>
          <img src="cid:hero-image"
               alt="Scenic view near ${locationName}"
               width="100%"
               style="display:block;border:0;max-height:260px;object-fit:cover;">
        </td>
      </tr>

      <tr>
        <td style="padding:20px 24px 8px 24px;background:#020617;color:#e5e7eb;">
          <div style="display:inline-block;padding:2px 8px;border-radius:999px;border:1px solid rgba(250,204,21,0.3);font-size:10px;letter-spacing:.16em;text-transform:uppercase;margin-bottom:10px;color:#facc15;">
            LOST · POSTCARD
          </div>
          <h1 style="margin:0 0 6px 0;font-size:24px;line-height:1.25;color:#f9fafb;">
            A place to get deliciously lost
          </h1>
          <p style="margin:0;font-size:13px;color:#9ca3af;">
            ${locationName}<br/>
            ${safeRegion}${safeDate ? " · " + safeDate : ""}
          </p>
        </td>
      </tr>

      <tr>
        <td style="padding:12px 24px 4px 24px;font-size:14px;line-height:1.6;color:#e5e7eb;background:#020617;">
          <p style="margin:0 0 10px 0;">Hi ${safeName},</p>
          <p style="margin:0 0 10px 0;">
            <strong style="color:#facc15;">LOST</strong> has picked somewhere off your usual map:
            <strong>${locationName}</strong>.
          </p>
          <p style="margin:0 0 10px 0;">${activity}</p>
          <p style="margin:0;">
            Don’t overthink it. Grab what you need, follow the pin, and see what you stumble into on the way.
          </p>
        </td>
      </tr>

      <!-- Mini map -->
      <tr>
        <td style="padding:16px 24px 20px 24px;background:#020617;">
          ${
            mapUrl
              ? `
          <a href="${mapUrl}" style="text-decoration:none;color:#93c5fd;">
            <img src="cid:map-image"
                 alt="Map near ${locationName}"
                 width="100%"
                 style="display:block;border-radius:14px;border:0;margin-bottom:6px;max-height:220px;object-fit:cover;">
            <div style="font-size:12px;color:#9ca3af;">
              Map preview — tap to open fully.
            </div>
          </a>
          `
              : `
          <div style="font-size:12px;color:#9ca3af;">
            Open the map from your LOST link to explore this spot.
          </div>
          `
          }
        </td>
      </tr>
    </table>

    <p style="margin:16px 0 0 0;font-size:11px;color:#6b7280;text-align:center;">
      Sent by LOST — tiny invitations to get off your usual map.
    </p>
  </body>
  </html>
  `;
}

module.exports = { postcardTemplate };
