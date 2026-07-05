# MeetSum – Setup & AI-workflow

## ✅ Wat is voorbereid

Je hebt nu:
- ✨ **Frontend**: Volledige UI met AI-knop
- 🔌 **Backend**: PowerShell server met `/api/summarize` endpoint
- 🔐 **Veiligheid**: API key in `.env` bestand (NOOIT in code of browser)
- 🧠 **LLM**: je eigen AI-model of provider

---

## 🚀 Setup in 3 stappen

### **Stap 1: AI sleutel ophalen**

1. Gebruik je eigen AI-omgeving of API-provider
2. Maak een sleutel aan volgens de documentatie van die provider
3. Bewaar je sleutel veilig buiten de browser

### **Stap 2: `.env` bestand maken**

Maak in de map `c:\Users\ding375970\Documents\Apps\Summarizer` een nieuw bestand:

**Bestandsnaam:** `.env`  
**Inhoud:**
```
GOOGLE_API_KEY=jouw_ai_api_key_hier
AI_MODEL=jouw_ai_model_hier
```

Vervang `jouw_ai_api_key_hier` met je echte sleutel.

Wil je een ander model gebruiken, pas dan alleen `AI_MODEL` aan.

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
4. **Je kopieert de prompt** en voert die uit in je eigen AI-omgeving ✉️
5. **Jouw omgeving verwerkt de prompt** met jouw sleutel of model (veilig! 🔐)
6. **Resultaat verschijnt** direct in stap 4
7. **Je downloadt als `.md` of `.txt`**

---

## 📊 AI-provider limieten

- ✅ 15 requests/minuut
- ✅ 500.000 tokens/maand
- ✅ 100.000 tokens/dag gratis

Perfect voor testing en personal use!

---

## 🐛 Troubleshooting

### ❌ "GOOGLE_API_KEY not found"
→ Controleer dat `.env` bestand correct in de map staat (niet als `.env.txt`)

### ❌ "API Error: 401 Unauthenticated"
→ Je sleutel is ongeldig. Maak een nieuwe sleutel aan in je provider-omgeving

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
