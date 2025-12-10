// netlify/functions/send-postcard.js
const { postcardTemplate } = require("./postcardTemplate.js");

// Simple free scenic image using Unsplash
function generateImageUrlForLocation(locationName, region) {
  const query = encodeURIComponent(`${locationName} ${region} landscape`);
  return `https://source.unsplash.com/featured/800x600/?${query}`;
}

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("Missing RESEND_API_KEY env var");
    return { statusCode: 500, body: "Email not configured" };
  }

  let payload;
  try {
    payload = JSON.parse(event.body || "{}");
  } catch (err) {
    console.error("Invalid JSON body", err);
    return { statusCode: 400, body: "Invalid JSON" };
  }

  const { email, locationName, region, activity, date, recipientName } = payload;

  if (!email || !locationName) {
    return { statusCode: 400, body: "Missing email or location" };
  }

  const imageUrl = generateImageUrlForLocation(
    locationName,
    region || "United Kingdom"
  );

  const html = postcardTemplate({
    locationName,
    region,
    activity,
    date,
    recipientName,
    imageUrl
  });

  try {
    const resp = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "LOST <wheretonext@gogetlost.uk>",
        to: [email],
        subject: `Let’s get lost in ${locationName}`,
        html,
      }),
    });

    if (!resp.ok) {
      const text = await resp.text();
      console.error("Resend error:", text);
      return { statusCode: 500, body: "Email send failed" };
    }

    return { statusCode: 200, body: JSON.stringify({ ok: true }) };
  } catch (err) {
    console.error("Resend request failed:", err);
    return { statusCode: 500, body: "Error sending email" };
  }
};
