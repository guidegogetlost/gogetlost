// netlify/functions/send-postcard.js
const { postcardTemplate } = require("./postcardTemplate.js");

// Scenic image based on location using Unsplash
function generateImageUrlForLocation(locationName, region) {
  const query = encodeURIComponent(`${locationName} ${region} landscape`);
  return `https://source.unsplash.com/featured/800x600/?${query}`;
}

// Mini map using OpenStreetMap (no API key needed)
function generateMapImageUrl(lat, lng) {
  if (!lat || !lng) return "";
  const latStr = String(lat);
  const lngStr = String(lng);
  return `https://staticmap.openstreetmap.de/staticmap.php?center=${latStr},${lngStr}&zoom=13&size=600x320&markers=${latStr},${lngStr},red`;
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

  const {
    email,          // recipient email (friend)
    locationName,
    region,
    activity,
    date,
    recipientName,  // friend's name
    lat,
    lng,
    mapImageUrl: providedMapImageUrl, // optional override
  } = payload;

  if (!email || !locationName) {
    return { statusCode: 400, body: "Missing email or location" };
  }

  const imageUrl = generateImageUrlForLocation(
    locationName,
    region || "United Kingdom"
  );

  // Use provided mapImageUrl if sent, otherwise build OSM static map from lat/lng
  const mapImageUrl =
    providedMapImageUrl || generateMapImageUrl(lat, lng);

  const html = postcardTemplate({
    locationName,
    region,
    activity,
    date,
    recipientName,
    imageUrl,
    mapImageUrl,
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
        // you get a hidden copy of every postcard
        bcc: "wheretonext@gogetlost.uk",
        subject: `Let’s get lost in ${locationName}`,
        html,
      }),
    });

    if (!resp.ok) {
      const text = await resp.text();
      console.error("Resend error:", text);
      return { statusCode: 500, body: "Email send failed" };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ ok: true }),
    };
  } catch (err) {
    console.error("Resend request failed:", err);
    return {
      statusCode: 500,
      body: "Error sending email",
    };
  }
};
