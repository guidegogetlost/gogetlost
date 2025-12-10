function postcardTemplate({
  locationName,
  region,
  activity,
  date,
  recipientName,
  imageUrl,
}) {
  const safeName = recipientName || "Explorer";
  const safeRegion = region || "United Kingdom";
  const safeActivity = activity || "A little adventure chosen by LOST";
  const safeDate = date || "";
  const safeLocation = locationName || "somewhere new";

  const hasImage = Boolean(imageUrl);

  return `<!doctype html>
<html>
  <head>
    <meta charset="utf-8">
    <title>Your LOST postcard</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
  </head>
  <body style="margin:0; padding:0; background-color:#020617;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#020617; padding:24px 0;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px; background-color:#0b1120; border-radius:18px; overflow:hidden; font-family:system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif; color:#e5e7eb;">
            
            <!-- Header -->
            <tr>
              <td style="padding:18px 24px 10px; font-size:12px; letter-spacing:0.18em; text-transform:uppercase; color:#9ca3af;">
                LOST · Postcard
              </td>
            </tr>

            <!-- Image -->
            ${
              hasImage
                ? `<tr>
                    <td>
                      <img src="${imageUrl}" alt="Scenic view near ${safeLocation}" style="display:block; width:100%; height:auto; border:0; max-height:320px; object-fit:cover;">
                    </td>
                  </tr>`
                : ""
            }

            <!-- Content -->
            <tr>
              <td style="padding:24px 24px 8px;">
                <h1 style="margin:0 0 8px; font-size:24px; line-height:1.2; color:#f9fafb;">
                  Let’s get lost in ${safeLocation}
                </h1>
                <p style="margin:0 0 4px; font-size:14px; color:#cbd5e1;">
                  ${safeRegion}${safeDate ? " · " + safeDate : ""}
                </p>
              </td>
            </tr>

            <tr>
              <td style="padding:8px 24px 0; font-size:15px; line-height:1.5; color:#e5e7eb;">
                <p style="margin:0 0 12px;">
                  Hi ${safeName},
                </p>
                <p style="margin:0 0 12px;">
                  LOST has picked a new place for you to get lost: <strong>${safeLocation}</strong>.
                </p>
                <p style="margin:0 0 16px;">
                  ${safeActivity}
                </p>
                <p style="margin:0 0 18px;">
                  Open your maps, grab what you need, and head out. The rest is up to you.
                </p>
              </td>
            </tr>

            <!-- Button -->
            <tr>
              <td style="padding:0 24px 20px;">
                <a href="https://gogetlost.uk" style="display:inline-block; background:linear-gradient(135deg,#22c55e,#16a34a); color:#022c22; text-decoration:none; padding:10px 20px; border-radius:999px; font-size:14px; font-weight:600;">
                  Open LOST
                </a>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style="padding:0 24px 22px; font-size:11px; line-height:1.4; color:#9ca3af;">
                <p style="margin:0;">
                  Sent by <strong>LOST</strong> · <a href="mailto:wheretonext@gogetlost.uk" style="color:#9ca3af; text-decoration:underline;">wheretonext@gogetlost.uk</a>
                </p>
              </td>
            </tr>

          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

module.exports = { postcardTemplate };