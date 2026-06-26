/**
 * MeetSum – Netlify Function: /api/pin-status
 * Returns whether PIN protection is enabled (based on env vars, not the key itself).
 */
"use strict";

exports.handler = async () => {
  const pinRequired = !!(process.env.PIN_HASH && process.env.PIN_SALT);
  return {
    statusCode: 200,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ pinRequired }),
  };
};
