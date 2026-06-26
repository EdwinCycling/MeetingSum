# 🎉 MeetSum is nu een PWA! 

## ✨ Wat is verbeterd

✅ **PWA (Progressive Web App)** — Installeer rechtstreeks vanuit je browser  
✅ **Native app ervaring** — Opent als standalone applicatie (geen browser-UI)  
✅ **Windows Start Menu** — Verschijnt als normale Windows app  
✅ **Offline support** — Werkt ook zonder internet (voor statische content)  
✅ **Sneller** — Service Worker cacht bestanden lokaal

---

## 🚀 Hoe te installeren

### **Methode 1: Via Browser (Makkelijkst!)**

1. **Start de app:**
   ```powershell
   cd "c:\Users\ding375970\Documents\Apps\Summarizer"
   powershell -ExecutionPolicy Bypass -File server-with-api.ps1
   ```

2. **Open in browser:** http://localhost:3000

3. **Klik op "Installeer"** knop in de header (rechtsbovenin)
   - Windows vraagt om bevestiging
   - Na OK: App wordt toegevoegd aan Start Menu en Desktop

4. **Klaar!** 
   - Zoek "MeetSum" in je Windows Start Menu
   - Of klik op Desktop shortcut
   - App opent zonder browser-UI

---

### **Methode 2: Via Desktop Shortcut (Klassiek)**

Dubbelklik op `MeetSum.lnk` op je desktop (dit is nog steeds beschikbaar).

---

## 📦 Wat gebeurt er na installatie

- 🖥️ MeetSum staat in je **Windows Start Menu**
- 📌 Je kunt het pinnen aan de Taakbalk
- 🎯 Het opent als echte app (geen browser-adresbalk)
- 💾 Alle je instellingen/transcripten blijven opgeslagen (localStorage)
- 🌐 Werkt offline voor het interface (API calls hebben internet nodig)

---

## ⚠️ Let op voor setup

Voordat je start:

1. **Maak `.env` bestand:**
   ```
   GOOGLE_API_KEY=jouw_google_api_key_hier
   ```

2. **Start server en installeer:**
   ```powershell
   powershell -ExecutionPolicy Bypass -File server-with-api.ps1
   ```

3. **Klik "Installeer"** in browser

---

## 🐛 Troubleshooting

**❌ "Installeer" knop verschijnt niet**
→ Je browser ondersteunt PWA installatie. Probeer Edge, Chrome of Chromium-based browser.

**❌ "API Error" na installatie**
→ .env bestand is niet ingeklapt. Check dat het in de app-map staat met je Google key.

**❌ Wil ik PWA verwijderen**
→ Open Windows Settings > Apps > MeetSum > Uninstall

---

**Veel plezier met je geïnstalleerde app! 🚀**
