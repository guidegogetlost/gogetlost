// netlify/functions/send-postcard.js
const { Resend } = require("resend");
const { postcardTemplate } = require("./postcardTemplate.js");

const resend = new Resend(process.env.RESEND_API_KEY);

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

    // Scenic image URL – Resend will fetch this and embed it
    const scenicImagePath = `https://source.unsplash.com/featured/1200x800/?landscape,uk,${encodeURIComponent(
      locationName
    )}`;

    // Map image + click-through URL
    let mapImagePath = "";
    let mapUrl = "";

    if (
      typeof lat === "number" &&
      typeof lng === "number" &&
      !Number.isNaN(lat) &&
      !Number.isNaN(lng)
    ) {
      const zoom = 11;
      const size = "600x260";

      mapImagePath = `https://staticmap.openstreetmap.de/staticmap.php?center=${lat},${lng}&zoom=${zoom}&size=${size}&markers=${lat},${lng},lightblue1`;
      mapUrl = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
    }

    const html = postcardTemplate({
      locationName,
      region,
      activity,
      date,
      recipientName,
      mapUrl,
    });

    // Inline attachments (CID)
    const attachments = [
      {
        path: scenicImagePath,
        filename: "scene.jpg",
        contentId: "hero-image",
      },
    ];

    if (mapImagePath) {
      attachments.push({
        path: mapImagePath,
        filename: "map.png",
        contentId: "map-image",
      });
    }

    const subject = `Your LOST postcard: ${locationName}`;

    const result = await resend.emails.send({
      from: "LOST via Resend <onboarding@resend.dev>", // later: your verified domain
      to: [email],
      // copy to you so you can track usage
      bcc: ["wheretonext@gogetlost.uk"],
      subject,
      html,
      attachments,
    });

    console.log("Postcard sent", result);

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
