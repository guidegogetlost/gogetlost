// netlify/functions/send-postcard.js

const { Resend } = require("resend");
const { postcardTemplate } = require("./postcardTemplate");

const resend = new Resend(process.env.RESEND_API_KEY);

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: "Method Not Allowed",
    };
  }

  if (!process.env.RESEND_API_KEY) {
    console.error("Missing RESEND_API_KEY env var");
    return {
      statusCode: 500,
      body: "Missing email configuration.",
    };
  }

  try {
    const payload = JSON.parse(event.body || "{}");

    const {
      email,
      locationName,
      region,
      activity,
      date,
      recipientName,
      lat,
      lng,
    } = payload;

    if (!email || !locationName) {
      return {
        statusCode: 400,
        body: "Missing required fields.",
      };
    }

    // -----------------------------
    // Scenic image (Unsplash)
    // -----------------------------
    // Simple, reliable URL – Unsplash will return a nice landscape
    // We vary by location name so you don't always get the same picture.
    const scenicImageUrl = `https://source.unsplash.com/featured/1200x800/?landscape,uk,${encodeURIComponent(
      locationName
    )}`;

    // -----------------------------
    // Static map image (OpenStreetMap)
    // -----------------------------
    let mapImageUrl = "";
    if (
      typeof lat === "number" &&
      typeof lng === "number" &&
      !Number.isNaN(lat) &&
      !Number.isNaN(lng)
    ) {
      const zoom = 11;
      const width = 600;
      const height = 300;

      // Simple static map server that works over HTTPS
      mapImageUrl = `https://staticmap.openstreetmap.de/staticmap.php?center=${lat},${lng}&zoom=${zoom}&size=${width}x${height}&markers=${lat},${lng},lightblue1`;
    }

    // -----------------------------
    // Build HTML postcard
    // -----------------------------
    const html = postcardTemplate({
      locationName,
      region: region || "United Kingdom",
      activity: activity || "A little adventure chosen by LOST.",
      date: date || new Date().toLocaleDateString("en-GB"),
      recipientName: recipientName || "",
      scenicImageUrl,
      mapImageUrl,
    });

    // -----------------------------
    // Send email via Resend
    // -----------------------------
    const subject = `Your LOST postcard: ${locationName}`;

    const emailResult = await resend.emails.send({
      from: "LOST via Resend <onboarding@resend.dev>", // or your verified domain later
      to: [email],
      // You can keep this BCC so you see usage
      bcc: ["wheretonext@gogetlost.uk"],
      subject,
      html,
    });

    console.log("Email sent:", emailResult);

    return {
      statusCode: 200,
      body: JSON.stringify({ ok: true }),
    };
  } catch (err) {
    console.error("send-postcard error:", err);
    return {
      statusCode: 500,
      body: "Failed to send postcard.",
    };
  }
};
