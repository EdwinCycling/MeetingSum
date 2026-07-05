/**
 * MeetSum – Netlify Function: /api/summarize
 * Disabled in this build; use the generated prompt in your own AI environment.
 */
"use strict";

exports.handler = async () => ({
  statusCode: 410,
  headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
  body: JSON.stringify({
    success: false,
    error: "AI summary endpoint disabled in this build. Use the generated prompt in your own AI environment.",
  }),
});
