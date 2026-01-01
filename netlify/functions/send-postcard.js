// netlify/functions/send-postcard.js
const https = require("https");
const { postcardTemplate } = require("./postcardTemplate.js");

// Helper to POST to Resend API using Node's https (no extra packages)
function sendViaResend(apiKey, payload) {
  return new Promise((resolve, reject) => {
    const json = JSON.stringify(payload);

    const options = {
      hostname: "api.resend.com",
      path: "/emails",
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(json),
      },
    };

    const req = https.request(options, (res) => {
      let body = "";
      res.on("data", (chunk) => (body += chunk));
      res.on("end", () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve({ statusCode: res.statusCode, body });
        } else {
          reject(
            new Error(`Resend error ${res.statusCode}: ${body.toString()}`)
          );
        }
      });
    });

    req.on("error", reject);
    req.write(json);
    req.end();
  });
}

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  if (!process.env.RESEND_API_KEY) {
    console.error("Missing RESEND_API_KEY");
    return { statusCode: 500, body: "Missing email configuration." };
  }

  try {
    const body = JSON.parse(event.body || "{}");
    const {
      email,
      locationName,
      region,
      activity,
      date,
      recipientName,
      lat,
      lng,
    } = body;

    if (!email || !locationName) {
      return { statusCode: 400, body: "Missing required fields." };
    }

    // Scenic hero image (Unsplash)
    const scenicImageUrl = `https://source.unsplash.com/featured/1200x800/?landscape,uk,${encodeURIComponent(
      locationName
    )}`;

    // Map image URL (also used as link)
    let mapImageUrl = "";
    if (
      typeof lat === "number" &&
      typeof lng === "number" &&
      !Number.isNaN(lat) &&
      !Number.isNaN(lng)
    ) {
      const zoom = 11;
      const width = 600;
      const height = 260;
      mapImageUrl = `https://staticmap.openstreetmap.de/staticmap.php?center=${lat},${lng}&zoom=${zoom}&size=${width}x${height}&markers=${lat},${lng},lightblue1`;
    }

    const html = postcardTemplate({
      locationName,
      region,
      activity,
      date: date || new Date().toLocaleDateString("en-GB"),
      recipientName,
      scenicImageUrl,
      mapImageUrl,
    });

    const subject = `Your LOST postcard: ${locationName}`;

    const resendPayload = {
      from: "LOST via Resend <onboarding@resend.dev>", // later: your own domain
      to: [email],
      bcc: ["wheretonext@gogetlost.uk"], // so you see usage
      subject,
      html,
    };

    const result = await sendViaResend(
      process.env.RESEND_API_KEY,
      resendPayload
    );
    console.log("Postcard sent", result.statusCode);

    return {
      statusCode: 200,
      body: JSON.stringify({ ok: true }),
    };
  } catch (error) {
    console.error("send-postcard error:", error);
    return {
      statusCode: 500,
      body: "Failed to send postcard.",
    };
  }
};
