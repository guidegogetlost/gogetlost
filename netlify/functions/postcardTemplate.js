// netlify/functions/postcardTemplate.js

function postcardTemplate({
  locationName,
  region,
  activity,
  date,
  recipientName,
  imageUrl,
  mapImageUrl, // optional mini map image
}) {
  const safeName = recipientName || "Explorer";
  const safeRegion = region || "Somewhere in the UK";
  const safeActivity = activity || "A little adventure chosen by LOST.";
  const safeDate = date || "";
  const safeLocation = locationName || "somewhere unexpected";

  const hasPhoto = Boolean(imageUrl);
  const hasMap = Boolean(mapImageUrl);

  // Change if your logo lives at a different URL
  const logoUrl = "https://gogetlost.uk/lost-hero.png";

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
          <!-- Card wrapper -->
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px; background-color:#020617; padding:1px; border-radius:20px; border:1px solid #1f2937;">
            <tr>
              <td>
                <!-- Inner card -->
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#0b1120; border-radius:18px; overflow:hidden; font-family:system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif; color:#e5e7eb;">
                  
                  <!-- Logo -->
                  <tr>
                    <td align="center" style="padding:16px 24px 8px;">
                      <img src="${logoUrl}" alt="LOST logo" style="height:32px; width:auto; display:block; margin:0 auto 4px;">
                      <div style="font-size:11px; letter-spacing:0.18em; text-transform:uppercase; color:#9ca3af;">
                        LOST · Postcard
                      </div>
                    </td>
                  </tr>

                  <!-- Hero image -->
                  ${
                    hasPhoto
                      ? `<tr>
                          <td>
                            <img src="${imageUrl}" alt="Scenic view near ${safeLocation}" style="display:block; width:100%; height:auto; border:0; max-height:320px; object-fit:cover;">
                          </td>
                        </tr>`
                      : ""
                  }

                  <!-- Text content -->
                  <tr>
                    <td style="padding:22px 24px 8px;">
                      <h1 style="margin:0 0 8px; font-size:24px; line-height:1.2; color:#f9fafb;">
                        A place to get deliciously lost
                      </h1>
                      <p style="margin:0 0 4px; font-size:14px; color:#cbd5e1;">
                        ${safeLocation}
                      </p>
                      <p style="margin:0 0 12px; font-size:13px; color:#9ca3af;">
                        ${safeRegion}${safeDate ? " · " + safeDate : ""}
                      </p>
                    </td>
                  </tr>

                  <tr>
                    <td style="padding:0 24px 4px; font-size:15px; line-height:1.5; color:#e5e7eb;">
                      <p style="margin:0 0 12px;">
                        Hi ${safeName},
                      </p>
                      <p style="margin:0 0 12px;">
                        LOST has picked somewhere off your usual map: <strong>${safeLocation}</strong>.
                      </p>
                      <p style="margin:0 0 14px;">
                        ${safeActivity}
                      </p>
                      <p style="margin:0 0 18px;">
                        Don’t overthink it. Grab what you need, follow the pin, and see what you stumble into on the way.
                      </p>
                    </td>
                  </tr>

                  <!-- Mini map -->
                  ${
                    hasMap
                      ? `<tr>
                          <td style="padding:0 24px 18px;">
                            <a href="${mapImageUrl}" style="text-decoration:none; border-radius:16px; overflow:hidden; display:block; border:1px solid #1f2937;">
                              <img src="${mapImageUrl}" alt="Map near ${safeLocation}" style="display:block; width:100%; height:auto; border:0;">
                            </a>
                            <p style="margin:8px 0 0; font-size:11px; color:#9ca3af;">
                              Map preview &mdash; tap to open fully.
                            </p>
                          </td>
                        </tr>`
                      : ""
                  }

                  <!-- Button -->
                  <tr>
                    <td style="padding:0 24px 22px;">
                      <a href="https://gogetlost.uk" style="display:inline-block; background:linear-gradient(135deg,#22c55e,#16a34a); color:#022c22; text-decoration:none; padding:10px 24px; border-radius:999px; font-size:14px; font-weight:600;">
                        Show me the spot
                      </a>
                    </td>
                  </tr>

                  <!-- Footer -->
                  <tr>
                    <td style="padding:0 24px 22px; font-size:11px; line-height:1.4; color:#9ca3af;">
                      <p style="margin:0;">
                        Sent by <strong>LOST</strong> · 
                        <a href="mailto:wheretonext@gogetlost.uk" style="color:#9ca3af; text-decoration:underline;">
                          wheretonext@gogetlost.uk
                        </a>
                      </p>
                    </td>
                  </tr>

                </table>
              </td>
            </tr>
          </table>
          <!-- end card wrapper -->
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

module.exports = { postcardTemplate };
