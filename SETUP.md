# MeetSum – Setup & Integratie Google Gemini API

## ✅ Wat is voorbereid

Je hebt nu:
- ✨ **Frontend**: Volledige UI met AI-knop
- 🔌 **Backend**: PowerShell server met `/api/summarize` endpoint
- 🔐 **Veiligheid**: API key in `.env` bestand (NOOIT in code of browser)
- 🧠 **LLM**: Google Gemini 1.5 Flash (gratis tier)

---

## 🚀 Setup in 3 stappen

### **Stap 1: Google Gemini API Key ophalen**

1. Ga naar: https://aistudio.google.com/apikey
2. Klik **"Create API Key"** → **"Create API key in new project"**
3. Kopieeer je key (ziet eruit als: `AIzaSyD...`)

### **Stap 2: `.env` bestand maken**

Maak in de map `c:\Users\ding375970\Documents\Apps\Summarizer` een nieuw bestand:

**Bestandsnaam:** `.env`  
**Inhoud:**
```
GOOGLE_API_KEY=jouw_google_api_key_hier
GEMINI_MODEL=gemini-3.5-flash
```

Vervang `jouw_google_api_key_hier` met je echte key.

Wil je een ander Gemini-model gebruiken, pas dan alleen `GEMINI_MODEL` aan.

⚠️ **LET OP**: 
- Dit bestand is in `.gitignore` (niet committen naar Git!)
- Nooit in de browser zichtbaar
- Enkel op je lokale computer

### **Stap 3: Server starten**

```powershell
cd "c:\Users\ding375970\Documents\Apps\Summarizer"
powershell -ExecutionPolicy Bypass -File server-with-api.ps1
```

Open dan: **http://localhost:3000**

---

## 🎯 Hoe het werkt

1. **Je plakt je Teams transcript** in stap 1
2. **Je selecteert secties** in stap 2
3. **Je klik "Genereer AI-Prompt"** — de prompt verschijnt
4. **Je klik "Genereer met AI"** — het gaat naar je backend ✉️
5. **Backend roept Gemini API aan** met jouw API key (veilig! 🔐)
6. **Samenvatting verschijnt** direct in stap 4
7. **Je downloadt als `.md` of `.txt`**

---

## 📊 Google Gemini Free Tier Limieten

- ✅ 15 requests/minuut
- ✅ 500.000 tokens/maand
- ✅ 100.000 tokens/dag gratis

Perfect voor testing en personal use!

---

## 🐛 Troubleshooting

### ❌ "GOOGLE_API_KEY not found"
→ Controleer dat `.env` bestand correct in de map staat (niet als `.env.txt`)

### ❌ "API Error: 401 Unauthenticated"
→ Je key is ongeldig. Haal een nieuwe op op https://aistudio.google.com/apikey

### ❌ "HTTP 429 Too Many Requests"
→ Je hebt te veel requests in korte tijd. Wacht even.

### ❌ De knop "Genereer met AI" verschijnt niet
→ Je transcript is leeg. Plak eerst een transcript!

---

## 📝 Volgende stappen (optioneel)

- [ ] Deploy naar cloud (Vercel, Netlify, Azure)
- [ ] UI feedback toevoegen voor langere verzoeken
- [ ] Andere LLM-providers ondersteunen (OpenAI, Anthropic)
- [ ] Voice input via Web Speech API
- [ ] Meeting opname direct uploaden

---

**Geniet van MeetSum! 🎉**
