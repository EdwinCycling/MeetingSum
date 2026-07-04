# Netlify environment variables for MeetingSum

Copy these values into Netlify > Site settings > Build & deploy > Environment variables.

| Variable | Value | Hidden |
|---|---|---|
| GOOGLE_API_KEY | your_google_api_key_here | Yes |
| GEMINI_MODEL | gemini-3.5-flash | No |
| PIN_HASH | your_pbkdf2_hash_here | Yes |
| PIN_SALT | your_base64_salt_here | Yes |
| PIN_ITER | 200000 | No |

## Copy-paste block

Use this block as a checklist while entering the values in Netlify:

```text
GOOGLE_API_KEY=your_google_api_key_here
GEMINI_MODEL=gemini-3.5-flash
PIN_HASH=your_pbkdf2_hash_here
PIN_SALT=your_base64_salt_here
PIN_ITER=200000
```

## Notes

- `GOOGLE_API_KEY`, `PIN_HASH`, and `PIN_SALT` should be treated as secrets and set to hidden in Netlify.
- `GEMINI_MODEL` is the selected model name. Start with `gemini-3.5-flash`.
- `PIN_ITER` is not secret; `200000` is the current default used by the app.
- If PIN protection is not enabled, you can omit `PIN_HASH`, `PIN_SALT`, and `PIN_ITER`.
