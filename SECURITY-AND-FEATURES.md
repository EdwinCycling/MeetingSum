# 🔒 MeetSum - Volledige Security & Features Gids

## ✅ SECURITY STATUS

### 1. **API Key Beveiliging**
- ✅ `.env` bestand is **NOOIT** public (in `.gitignore`)
- ✅ Google API key **staat NOOIT in de browser**
- ✅ Key zit **veilig in de server** (PowerShell backend)
- ✅ Path traversal beschermd: `.env` kan NIET via HTTP opgehaald worden
- ✅ Gevoelige bestanden (`.ps1`, `.bat`, `.log`) zijn VERBORGEN (HTTP 403)
- ✅ AI-model is instelbaar via `GEMINI_MODEL` in `.env` of Netlify env vars

### 2. **PIN-Beveiliging (optioneel)**
De API-aanroepen kunnen beschermd worden met een 4-cijferige PIN:
- ✅ PIN wordt **NOOIT plain-text** opgeslagen
- ✅ Gebruikt **PBKDF2-hashing** (200.000 iteraties, veilig zout)
- ✅ Brute-force bescherming: 5 foute pogingen = 60 seconden lockout
- ✅ PIN zit in `.env` als hash (zelfs jij kunt het niet terugzien)

### 3. **Bestand Uploads**
- ✅ Bestanden blijven **100% lokaal** in je browser
- ✅ **Nooit** naar internet gestuurd (behalve de final prompt naar je AI-omgeving)
- ✅ Ondersteunde formaten: `.txt` · `.md` · `.pdf` · `.docx`
- ✅ Max 15 MB per bestand

---

## 🔐 PIN SETUP (Optioneel maar Aanbevolen)

### Stap 1: PIN instellen

```powershell
cd "c:\Users\ding375970\Documents\Apps\Summarizer"
powershell -ExecutionPolicy Bypass -File set-pin.ps1
```

- Voer een 4-cijferige PIN in (bijv. `1234`)
- Bevestig
- PIN-hash wordt in `.env` opgeslagen

### Stap 2: Server herstarten

Nu vraagt de app om een PIN voordat je AI-summarysering kunt gebruiken.

### PIN verwijderen?

Edit je `.env` bestand en verwijder deze regels:
```
PIN_HASH=...
PIN_SALT=...
PIN_ITER=...
```

## 🤖 MODEL SELECTIE

Standaard gebruikt MeetSum het ingestelde model uit je env-variabele.

Wil je een ander model gebruiken, zet dan in `.env` of Netlify environment variables:
```
GEMINI_MODEL=...
```

De app probeert eerst het ingestelde model en valt daarna terug op andere ondersteunde modellen.

---

## 📤 BESTANDUPLOAD - Hoe Te Gebruiken

### Ondersteunde bestanden:

| Type | Beschrijving |
|------|-------------|
| **.txt** | Platte tekst (ideal voor Teams transcripts) |
| **.md** | Markdown formaat |
| **.pdf** | PDF-documenten (alle pagina's gescanned) |
| **.docx** | Microsoft Word 2007+ |

### Upload methodes:

**Methode 1: Sleep & drop**
1. Ga naar stap 1 ("Transcript & Taal")
2. Sleep een bestand in de **drop zone** (grijs gebied met icoon)
3. Klaar! Tekst verschijnt automatisch

**Methode 2: Klikken**
1. Klik op **"blader"** link in de drop zone
2. Selecteer bestand
3. Klaar!

### Wat gebeurt er?
- Bestand wordt **in de browser geparst**
- Tekst geëxtraheerd en in het transcript veld gezet
- Jij kunt het nog **handmatig bewerken**
- Geen data naar internet (behalve naar je AI-omgeving voor analyse)

---

## 🔍 SECURITY TESTEN (Already Done ✅)

```
✅ PIN Status:           pinRequired = false (tot je PIN instelt)
✅ Path Traversal:       .env niet toegankelijk (HTTP 403)
✅ Sensitive Files:      .ps1/.bat niet toegankelijk (HTTP 403)
✅ Normal File Access:   index.html/styles.css werken (HTTP 200)
```

---

## 🚀 COMPLETE WORKFLOW

1. **Start de app**
   ```powershell
   dubbelklik START-MEETSUM.bat
   ```

2. **Optioneel: PIN instellen**
   ```powershell
   powershell -ExecutionPolicy Bypass -File set-pin.ps1
   ```
   (Daarna vraagt de app om PIN voor AI-summarize)

3. **Transcript uploaden**
   - Sleep een `.txt`, `.pdf`, `.docx` of `.md` bestand in de drop zone
   - Of plak handmatig

4. **Secties selecteren**
   - Kies welke secties je in de samenvatting wilt

5. **Genereer met AI**
   - Klik "Genereer AI-Prompt"
   - Klik "Genereer met AI"
   - (PIN wordt gevraagd als je die hebt ingesteld)
   - Wacht op AI response

6. **Download**
   - Klik "📥 Download .md" of ".txt"

---

## 📊 HUIDIGESTATUS

| Component | Status |
|-----------|--------|
| Server | ✅ Draaiend op localhost:3000 |
| AI API | ✅ Verbonden (ingesteld model) |
| Path Traversal Bescherming | ✅ Aktief |
| Sensitive File Blocking | ✅ Aktief |
| PIN-beveiliging | ⚪ Beschikbaar (niet ingesteld) |
| PDF Parser | ✅ Beschikbaar (via CDN) |
| Word Parser | ✅ Beschikbaar (via CDN) |
| File Size Limit | ✅ 15 MB max |

---

## 🎯 BEST PRACTICES

1. **Bewaar je `.env` bestand veilig**
   - Niet committen naar Git (staat in `.gitignore`)
   - Niet delen met anderen

2. **Gebruik de PIN**
   - Stel hem in als je gedeelde computers hebt
   - 4 cijfers is voldoende (brute-force bescherming aktief)

3. **Bestand uploads**
   - Grote PDF's (~50+ pagina's) kunnen traag zijn
   - Internet nodig voor PDF/Word parsing (cloud libraries)
   - Transcription tekst blijft **100% lokaal**

4. **Google API quota**
   - Free tier: 15 requests/minuut, 500k tokens/maand
   - Ideaal voor personal/testing use
   - Per 1500 woorden ~1-2 API calls

---

## ❓ FAQ

**V: Is mijn Google API key veilig?**
A: Ja! De key staat in `.env` op je lokale schijf, nooit in de browser, en de server blokkeert path traversal attacks.

**V: Worden mijn transcripten ergens opgeslagen?**
A: Nee! Alles blijft in je browser via `localStorage` (lokale opslag). Server ontvangt alleen de prompt, geen transcript zelf.

**V: Kan ik PIN-toegang resetten?**
A: Ja - verwijder de `PIN_*` regels uit `.env` en herstart de server. Geen PIN meer nodig.

**V: Werkt de app offline?**
A: Gedeeltelijk:
- UI/interface: ✅ Ja (via Service Worker)
- Bestand parsing (.pdf/.docx): ❌ Nee (internet nodig voor libraries)
- AI summarize: ❌ Nee (Google API nodig)
- Normale functies: ✅ Ja

---

**Klaar? Start de app met dubbelklik op `START-MEETSUM.bat`! 🚀**
