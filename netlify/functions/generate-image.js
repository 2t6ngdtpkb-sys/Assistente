// netlify/functions/generate-image.js
// Generates an image from a text prompt using OpenAI's image API
// (swap provider/model freely; just keep the response shape).

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method not allowed" };
  }

  try {
    if (!process.env.OPENAI_API_KEY) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "OPENAI_API_KEY non configurata su Netlify (Site settings > Environment variables)." }),
      };
    }

    const { prompt } = JSON.parse(event.body || "{}");
    if (!prompt) {
      return { statusCode: 400, body: JSON.stringify({ error: "Missing prompt" }) };
    }

    const response = await fetch("https://api.openai.com/v1/images/generations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-image-1",
        prompt,
        size: "1024x1024",
      }),
    });

    const data = await response.json();

    if (!response.ok || data.error) {
      const msg = data.error?.message || `OpenAI API ha risposto con status ${response.status}`;
      return { statusCode: 500, body: JSON.stringify({ error: msg }) };
    }

    const b64 = data.data?.[0]?.b64_json;
    if (!b64) {
      return { statusCode: 500, body: JSON.stringify({ error: "No image returned" }) };
    }

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ base64: b64, mediaType: "image/png" }),
    };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: String(err) }) };
  }
};
