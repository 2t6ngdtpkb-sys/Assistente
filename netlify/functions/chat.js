// netlify/functions/chat.js
// Proxies chat requests to the Anthropic API, supporting multimodal
// content blocks (text, image, document) sent from the frontend.

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method not allowed" };
  }

  try {
    if (!process.env.ANTHROPIC_API_KEY) {
      return {
        statusCode: 500,
        body: JSON.stringify({ reply: null, error: "ANTHROPIC_API_KEY non configurata su Netlify (Site settings > Environment variables)." }),
      };
    }

    const { system, messages } = JSON.parse(event.body || "{}");

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: 2000,
        system,
        messages,
      }),
    });

    const data = await response.json();

    if (!response.ok || data.error) {
      const msg = data.error?.message || `Anthropic API ha risposto con status ${response.status}`;
      return { statusCode: 500, body: JSON.stringify({ reply: null, error: msg }) };
    }

    const reply = (data.content || [])
      .filter((block) => block.type === "text")
      .map((block) => block.text)
      .join("\n");

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reply }),
    };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ reply: null, error: String(err) }) };
  }
};
