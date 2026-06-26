/**
 * MeetSum – Netlify Function: /api/summarize
 * Proxies the Gemini API server-side; the API key is NEVER sent to the browser.
 */
"use strict";

const https = require("https");
const crypto = require("crypto");

const MAX_PROMPT_CHARS = 100_000;  // ~25,000 tokens – more than enough for any transcript
const GEMINI_MODELS = [
  "gemini-2.5-flash",
  "gemini-2.0-flash",
  "gemini-1.5-flash",
  "gemini-flash-latest",
];

// ---- PIN verification (constant-time PBKDF2) ----
function verifyPin(pin, storedHash, storedSalt, iterations) {
  try {
    const saltBytes = Buffer.from(storedSalt, "base64");
    const iters = Math.min(Math.max(parseInt(iterations, 10) || 200000, 10000), 500000);
    const computed = crypto.pbkdf2Sync(pin, saltBytes, iters, 32, "sha256");
    const computedB64 = computed.toString("base64");
    const a = Buffer.from(computedB64);
    const b = Buffer.from(storedHash);
    if (a.length !== b.length) return false;
    return crypto.timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

// ---- Single Gemini API call ----
function callGemini(apiKey, model, promptText) {
  return new Promise((resolve, reject) => {
    const bodyStr = JSON.stringify({
      contents: [{ parts: [{ text: promptText }] }],
      generationConfig: { temperature: 0.7, maxOutputTokens: 4096 },
    });

    const options = {
      hostname: "generativelanguage.googleapis.com",
      path: `/v1beta/models/${model}:generateContent?key=${apiKey}`,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(bodyStr),
      },
    };

    const req = https.request(options, (res) => {
      let data = "";
      res.on("data", (chunk) => { data += chunk; });
      res.on("end", () => resolve({ status: res.statusCode, body: data }));
    });

    req.setTimeout(90_000, () => {
      req.destroy(new Error("Request timed out"));
    });
    req.on("error", reject);
    req.write(bodyStr);
    req.end();
  });
}

// ---- Lambda handler ----
exports.handler = async (event) => {
  // Only allow POST
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: JSON.stringify({ error: "Method not allowed" }) };
  }

  // API key must be configured in Netlify environment variables
  const apiKey = process.env.GOOGLE_API_KEY;
  if (!apiKey) {
    return { statusCode: 503, body: JSON.stringify({ error: "AI service not configured" }) };
  }

  // Parse request body
  let payload;
  try {
    payload = JSON.parse(event.body || "{}");
  } catch {
    return { statusCode: 400, body: JSON.stringify({ error: "Invalid request body" }) };
  }

  const { prompt, pin } = payload;

  // Validate prompt
  if (!prompt || typeof prompt !== "string" || prompt.trim().length === 0) {
    return { statusCode: 400, body: JSON.stringify({ error: "Prompt is required" }) };
  }
  if (prompt.length > MAX_PROMPT_CHARS) {
    return {
      statusCode: 413,
      body: JSON.stringify({ error: `Prompt too large (max ${MAX_PROMPT_CHARS.toLocaleString()} characters)` }),
    };
  }

  // PIN verification (only if PIN is configured via env vars)
  const PIN_HASH = process.env.PIN_HASH;
  const PIN_SALT = process.env.PIN_SALT;
  const PIN_ITER = process.env.PIN_ITER || "200000";

  if (PIN_HASH && PIN_SALT) {
    if (!pin || typeof pin !== "string") {
      return { statusCode: 401, body: JSON.stringify({ error: "PIN required", pinRequired: true }) };
    }
    if (!verifyPin(pin, PIN_HASH, PIN_SALT, PIN_ITER)) {
      // Artificial delay to slow brute-force attempts
      await new Promise((r) => setTimeout(r, 1500));
      return { statusCode: 401, body: JSON.stringify({ error: "Onjuiste PIN" }) };
    }
  }

  // Call Gemini with model fallback chain
  let lastError = "Unknown error";

  for (const model of GEMINI_MODELS) {
    for (let attempt = 1; attempt <= 2; attempt++) {
      try {
        const { status, body } = await callGemini(apiKey, model, prompt);

        if (status === 200) {
          let result;
          try { result = JSON.parse(body); } catch { lastError = "Invalid JSON from Gemini"; break; }

          const text = result?.candidates?.[0]?.content?.parts?.[0]?.text;
          if (text) {
            return {
              statusCode: 200,
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ success: true, text, model }),
            };
          }
          lastError = `No text in response from ${model}`;
          break; // try next model
        }

        if (status === 503 || status === 429) {
          lastError = `${model} temporarily unavailable (${status})`;
          if (attempt < 2) await new Promise((r) => setTimeout(r, 800));
          continue; // retry same model
        }

        lastError = `${model} returned HTTP ${status}`;
        break; // non-retryable error → try next model

      } catch (err) {
        lastError = String(err.message);
        if (attempt < 2) await new Promise((r) => setTimeout(r, 500));
      }
    }
  }

  return {
    statusCode: 503,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      success: false,
      error: `Alle AI-modellen zijn tijdelijk onbeschikbaar. (${lastError})`,
    }),
  };
};
