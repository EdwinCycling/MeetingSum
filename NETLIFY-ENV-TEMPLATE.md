# Netlify environment variables for MeetingSum

Copy these values into Netlify > Site settings > Build & deploy > Environment variables.

| Variable | Value | Hidden |
|---|---|---|
| GOOGLE_API_KEY | your_google_api_key_here | Yes |
| AI_MODEL | your_ai_model_here | No |
| PIN_HASH | your_pbkdf2_hash_here | Yes |
| PIN_SALT | your_base64_salt_here | Yes |
| PIN_ITER | your_pin_iterations_here | No |

## Copy-paste block

Use this block as a checklist while entering the values in Netlify:

```text
GOOGLE_API_KEY=your_google_api_key_here
AI_MODEL=your_ai_model_here
PIN_HASH=your_pbkdf2_hash_here
PIN_SALT=your_base64_salt_here
PIN_ITER=your_pin_iterations_here
```

## Notes

- `GOOGLE_API_KEY`, `PIN_HASH`, and `PIN_SALT` should be treated as secrets and set to hidden in Netlify.
- `AI_MODEL` is the selected model name. Use the same model name you set in Netlify.
- `PIN_ITER` is not secret; use the same iteration value that your PIN generator produced.
- If PIN protection is not enabled, you can omit `PIN_HASH`, `PIN_SALT`, and `PIN_ITER`.
