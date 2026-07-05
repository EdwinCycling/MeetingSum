/**
 * MeetSum – Netlify Function: /api/verify-pin
 * Verifies a PIN using the same PBKDF2 algorithm as server.ps1 (SHA-256, 200 000 iterations).
 */
"use strict";

const crypto = require("crypto");

function verifyPin(pin, storedHash, storedSalt, iterations) {
  try {
    const saltBytes = Buffer.from(storedSalt, "base64");
    const iters = Math.min(Math.max(parseInt(iterations, 10) || (200 * 1000), 10000), 500000);
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

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: JSON.stringify({ error: "Method not allowed" }) };
  }

  const PIN_HASH = process.env.PIN_HASH;
  const PIN_SALT = process.env.PIN_SALT;
  const PIN_ITER = process.env.PIN_ITER || String(200 * 1000);

  // If no PIN configured, always succeed
  if (!PIN_HASH || !PIN_SALT) {
    return { statusCode: 200, body: JSON.stringify({ success: true }) };
  }

  let payload;
  try {
    payload = JSON.parse(event.body || "{}");
  } catch {
    return { statusCode: 400, body: JSON.stringify({ success: false, error: "Invalid request" }) };
  }

  const { pin } = payload;
  if (!pin || typeof pin !== "string" || !/^\d{4}$/.test(pin)) {
    return { statusCode: 400, body: JSON.stringify({ success: false, error: "Voer 4 cijfers in." }) };
  }

  if (verifyPin(pin, PIN_HASH, PIN_SALT, PIN_ITER)) {
    return { statusCode: 200, body: JSON.stringify({ success: true }) };
  }

  // Slow down brute-force
  await new Promise((r) => setTimeout(r, 1500));
  return { statusCode: 401, body: JSON.stringify({ success: false, error: "Onjuiste PIN" }) };
};
