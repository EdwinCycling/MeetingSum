/* =========================================================
   MeetSum – Nederlandse vertalingen (standaard)
   ========================================================= */
window.LANG_NL = {
  "html.lang": "nl",

  /* ---- Header / nav ---- */
  "nav.start": "Aan de slag",
  "install.label": "Installeer",
  "install.title": "Installeer als app",
  "install.ariaLabel": "Installeer MeetSum",
  "theme.ariaLabel": "Wissel tussen licht en donker thema",
  "theme.title": "Wissel thema",
  "uiLang.ariaLabel": "Interfacetaal",

  /* ---- Hero ---- */
  "hero.pill": "✨ AI Prompt Generator voor MS Teams",
  "hero.h1": "Van ruw transcript naar",
  "hero.h1.accent": "een vlijmscherpe samenvatting",
  "hero.sub": "Plak je (Teams)transcript of een ander document, kies precies welke onderdelen je wilt zien en hoe je output eruit moet zien, en MeetSum bouwt een professionele AI-prompt voor je en indien gewenst ook de AI-output via Google Gemini. Geen ruis, alleen resultaat.",
  "hero.cta.start": "Begin nu \u2192",
  "hero.cta.sections": "Bekijk secties",
  "hero.badge.local": "\uD83D\uDD12 100% lokaal in je browser",
  "hero.badge.langs": "\uD83C\uDF0D 5 talen",
  "hero.badge.prefs": "\uD83D\uDCBE Onthoudt je voorkeuren",

  /* ---- Step 1 ---- */
  "step1.title": "Transcript & Taal",
  "step1.desc": "Plak het volledige Teams-transcript en kies de taal van je samenvatting.",
  "step1.label.transcript": "Teams transcript",
  "step1.drop.strong": "Sleep een bestand hierheen",
  "step1.drop.or": "of",
  "step1.drop.browse": "blader",
  "step1.drop.hint": ".txt \u00b7 .md \u00b7 .pdf \u00b7 .docx",
  "step1.placeholder.transcript": "\u2026of plak hier je MS Teams transcript\n\nBijv:\n[00:00] Jan Jansen: Welkom allemaal bij de wekelijkse sprint review\u2026",
  "step1.charCount": function (n) { return n.toLocaleString("nl-NL") + " teken" + (n === 1 ? "" : "s"); },
  "step1.clear": "Wissen",
  "step1.label.summaryLang": "Taal van de samenvatting",
  "lang.option.nl": "\uD83C\uDDF3\uD83C\uDDF1 Nederlands",
  "lang.option.en": "\uD83C\uDDEC\uD83C\uDDE7 Engels",
  "lang.option.de": "\uD83C\uDDE9\uD83C\uDDEA Duits",
  "lang.option.fr": "\uD83C\uDDEB\uD83C\uDDF7 Frans",
  "lang.option.es": "\uD83C\uDDEA\uD83C\uDDF8 Spaans",

  /* ---- Step 2 ---- */
  "step2.title": "Selecteer secties",
  "step2.desc": "Vink aan welke onderdelen in de samenvatting moeten komen. Je keuze wordt onthouden.",
  "step2.selectAll": "Alles selecteren",
  "step2.selectNone": "Niets selecteren",
  "step2.selectDefault": "Standaard set",
  "step2.resetOrder": "Volgorde herstellen",
  "step2.dragHint": "\u283f Versleep een blok om de volgorde aan te passen",
  "step2.dragHandle.title": "Versleep om volgorde te wijzigen",

  /* ---- Step 3: uitvoer opties ---- */
  "step3.title": "Uitvoer opties",
  "step3.desc": "Pas het niveau, de stijl en het format van de samenvatting aan op je wensen.",
  "step3.niveau.label": "Niveau",
  "step3.niveau.simpel": "Eenvoudig (lagere school)",
  "step3.niveau.middelbaar": "Middelbare school",
  "step3.niveau.professioneel": "Professioneel (standaard)",
  "step3.niveau.technisch": "Technisch / vakjargon",
  "step3.niveau.expert": "Expert / directieniveau",
  "step3.type.label": "Documenttype",
  "step3.type.verslag": "Verslag / notulen",
  "step3.type.blog": "Blog",
  "step3.type.verhaal": "Verhaal / narratief",
  "step3.type.memo": "Beknopte memo",
  "step3.type.email": "E-mail update",
  "step3.type.presentatie": "Presentatie bullets",
  "step3.lengte.label": "Lengte",
  "step3.lengte.kort": "Kort en krachtig",
  "step3.lengte.standaard": "Standaard",
  "step3.lengte.uitgebreid": "Uitgebreid (alle details)",
  "step3.register.label": "Schrijfstijl",
  "step3.register.informeel": "Informeel (je / jij)",
  "step3.register.neutraal": "Neutraal / zakelijk",
  "step3.register.formeel": "Formeel (u)",
  "step3.anoniem.label": "Anonimiseren",
  "step3.anoniem.hint": "Namen vervangen door Medewerker 1, Medewerker 2, ...",
  "step3.inclusievBron.label": "Inclusief bronverwijzingen",
  "step3.inclusievBron.hint": "Voeg bronnen toe in [*italic format*]",
  "step3.doelgroep.label": "Doelgroep",
  "step3.doelgroep.team": "Intern team",
  "step3.doelgroep.management": "Management / directie",
  "step3.doelgroep.extern": "Externe stakeholders",
  "step3.doelgroep.klant": "Klant",
  "step3.opmaak.label": "Opmaakvoorkeur",
  "step3.opmaak.auto": "Automatisch",
  "step3.opmaak.bullets": "Bulletpoints",
  "step3.opmaak.paragrafen": "Paragrafen",

  /* ---- Step 4: genereer prompt ---- */
  "step4.title": "Genereer je AI-prompt",
  "step4.desc": "MeetSum bouwt een complete, gestructureerde prompt op basis van je keuzes.",
  "step4.generateBtn": "\u26a1 Genereer AI-prompt",
  "step4.promptTitle": "Je AI-prompt",
  "step4.copyPrompt": "\uD83D\uDCCB Kopieer prompt",
  "step4.generateWithAI": "\uD83D\uDD12 Genereer via Google Gemini",
  "step4.hint": "Wil je veilig via een bedrijfs-AI-account de samenvatting maken, kopieer dan de prompt en activeer die bijvoorbeeld in je Copilot-omgeving. De prompt bevat ook je brontekst, dus met 1 kopieeractie ben je klaar en veilig.",
  "step4.sidebarTitle": "Geselecteerde secties",

  /* ---- Step 5: resultaat ---- */
  "step5.title": "Resultaat & download",
  "step5.desc": "De AI-samenvatting verschijnt hier automatisch na de analyse. Je kunt hem daarna nog bewerken, kopieren en downloaden.",
  "step5.label.result": "AI-samenvatting (Markdown ondersteund)",
  "step5.editBtn": "\u270f\ufe0f Bewerken",
  "step5.lockBtn": "\uD83D\uDD12 Vergrendelen",
  "step5.placeholder.result": "Nog geen resultaat - gebruik stap 4 en klik op 'Genereer met AI'.",
  "step5.viewPreview": "\uD83D\uDC41\ufe0f Voorbeeld",
  "step5.viewRaw": "\uD83D\uDCC4 Markdown",
  "step5.ariaView": "Weergave",
  "step5.copyResult": "\uD83D\uDCCB Kopi\u00ebr",
  "step5.emptyState": "Nog geen resultaat. Genereer eerst een samenvatting met AI in stap 4.",

  /* ---- Footer ---- */
  "footer.text": "Gemaakt met \uD83D\uDC9C - <strong>MeetSum</strong>. Je gegevens blijven volledig in je eigen browser.",

  /* ---- Loader ---- */
  "loader.title": "Samenvatting genereren\u2026",
  "loader.initial": "Even geduld, de AI analyseert je transcript.",
  "loader.stage1": "Transcript wordt voorbereid\u2026",
  "loader.stage2": "Verbinden met AI-model\u2026",
  "loader.stage3": "De AI analyseert je vergadering\u2026",
  "loader.stage4": "Samenvatting wordt geschreven\u2026",
  "loader.stage5": "Bijna klaar\u2026",
  "loader.done": "Klaar! \uD83C\uDF89",

  /* ---- PIN modal ---- */
  "pin.title": "Voer je PIN in",
  "pin.desc": "Deze PIN beschermt het gebruik van je Google API key.",
  "pin.cancel": "Annuleren",
  "pin.submit": "Ontgrendelen",
  "pin.checking": "Controleren\u2026",
  "pin.digit": function (n) { return "Cijfer " + n; },
  "pin.error.digits": "Voer 4 cijfers in.",
  "pin.error.invalid": "Onjuiste PIN",
  "pin.error.server": "Serverfout. Probeer opnieuw.",

  /* ---- Toasts ---- */
  "toast.orderReset": "Volgorde hersteld naar standaard.",
  "toast.noSection": "Selecteer eerst minimaal \u00e9\u00e9n sectie.",
  "toast.noTranscript": "Tip: plak een transcript voor het beste resultaat.",
  "toast.resultRefreshed": "\u2705 Resultaat ververst!",
  "toast.appInstalled": "\u2705 MeetSum is ge\u00efnstalleerd!",
  "toast.promptCopied": "Prompt gekopi\u00eberd! \uD83D\uDCCB",
  "toast.resultCopied": "Samenvatting gekopi\u00eberd! \uD83D\uDCCB",
  "toast.downloaded": function (ext) { return "Gedownload als ." + ext; },
  "toast.fileLoaded": function (name) { return "Bestand geladen: " + name; },
  "toast.editEnabled": "Bewerken ingeschakeld \u270f\ufe0f",

  /* ---- Buttons ---- */
  "btn.generating": "\u23f3 Genereren...",

  /* ---- File handling ---- */
  "file.tooBig": "\u274c Bestand te groot (max 15 MB)",
  "file.noText": "Geen tekst gevonden in bestand.",
  "file.unsupported": "Niet-ondersteund bestandstype.",
  "file.docOld": "Oud .doc-formaat wordt niet ondersteund. Sla op als .docx of .txt.",
  "file.pdfNotLoaded": "PDF-parser niet geladen (internet nodig).",
  "file.wordNotLoaded": "Word-parser niet geladen (internet nodig).",

  /* ---- Download ---- */
  "download.filename": function (date, ext) { return "meetsum-samenvatting-" + date + "." + ext; },

  /* ---- Summary target language names (value → name in prompt) ---- */
  "summaryLangNames": {
    "Nederlands": "Nederlands",
    "Engels": "Engels",
    "Duits": "Duits",
    "Frans": "Frans",
    "Spaans": "Spaans"
  },

  /* ---- Section definitions ---- */
  "sections": {
    "doel": {
      title: "Doel van de meeting",
      desc: "Korte openingszin en de belangrijkste aanleiding voor dit gesprek.",
      prompt: "**Doel van de meeting**: Begin met een korte openingszin die het hoofddoel en de belangrijkste aanleiding van deze meeting beschrijft (1-2 zinnen)."
    },
    "hoofdpunten": {
      title: "Hoofdpunten (discussie)",
      desc: "Essentie van de gevoerde discussies per onderwerp met bulletpoints.",
      prompt: "**Hoofdpunten (discussie)**: Vat de essentie van de gevoerde discussies samen, gegroepeerd per onderwerp. Gebruik per onderwerp een korte kop gevolgd door bulletpoints met de kernpunten."
    },
    "beslissingen": {
      title: "Genomen beslissingen",
      desc: "Alles wat definitief is afgestemd of goedgekeurd.",
      prompt: "**Genomen beslissingen**: Som in een duidelijke bulletlijst alles op wat definitief is afgestemd, besloten of goedgekeurd. Wees concreet en ondubbelzinnig."
    },
    "actiepunten": {
      title: "Actiepunten",
      desc: "In een SMART-geformuleerde tabel (Wat/Taak | Wie | Wanneer).",
      prompt: "**Actiepunten**: Presenteer alle actiepunten in een Markdown-tabel met de kolommen | Wat/Taak | Wie | Wanneer |. Formuleer elke taak SMART (Specifiek, Meetbaar, Acceptabel, Realistisch, Tijdgebonden). Gebruik 'Onbekend' als een eigenaar of deadline niet uit het transcript blijkt."
    },
    "parkeerplaats": {
      title: "Parkeerplaats en vervolgstappen",
      desc: "Onderwerpen buiten scope en afspraken voor de volgende bijeenkomst.",
      prompt: "**Parkeerplaats en vervolgstappen**: Noem onderwerpen die buiten scope vielen of zijn doorgeschoven, en beschrijf de concrete afspraken of agenda voor de volgende bijeenkomst."
    },
    "executive": {
      title: "Executive Summary",
      desc: "Korte, krachtige samenvatting voor directie/management (3-5 zinnen).",
      prompt: "**Executive Summary**: Schrijf een korte, krachtige samenvatting (3-5 zinnen) gericht op directie/management. Focus op uitkomsten, impact en besluiten, niet op details."
    },
    "slotzin": {
      title: "Slotzin",
      desc: "Een motiverende of samenvattende uitsmijter.",
      prompt: "**Slotzin**: Sluit af met \u00e9\u00e9n motiverende of samenvattende uitsmijter die de meeting positief afrondt."
    },
    "details": {
      title: "Meeting Details",
      desc: "Datum, tijd en aanwezigen (indien af te leiden uit transcript).",
      prompt: "**Meeting Details**: Vermeld datum, tijd en aanwezigen voor zover deze uit het transcript af te leiden zijn. Laat velden weg of markeer als 'Niet vermeld' wanneer de informatie ontbreekt; verzin niets."
    },
    "verbeterpunten": {
      title: "Punten voor verbetering",
      desc: "Wat kon er beter in het proces of de meeting?",
      prompt: "**Punten voor verbetering**: Benoem in bulletpoints wat er beter kon in het proces of de meeting zelf (structuur, voorbereiding, besluitvorming, etc.)."
    },
    "goedpunten": {
      title: "Punten die goed gingen",
      desc: "Wat verliep soepel of positief?",
      prompt: "**Punten die goed gingen**: Benoem in bulletpoints wat er soepel of positief verliep tijdens de meeting."
    },
    "sentiment": {
      title: "Sentiment en sfeer",
      desc: "De algehele toon van het gesprek (constructief, gespannen, enthousiast, ...).",
      prompt: "**Sentiment en sfeer**: Beschrijf de algehele toon en sfeer van het gesprek (bijv. constructief, gespannen, enthousiast) met een korte onderbouwing op basis van het transcript."
    },
    "risicos": {
      title: "Risico's en knelpunten",
      desc: "Potenti\u00eble gevaren of obstakels.",
      tag: "Extra",
      prompt: "**Risico's en knelpunten**: Identificeer in bulletpoints potenti\u00eble risico's, gevaren of obstakels die genoemd zijn of impliciet uit de discussie volgen."
    },
    "tags": {
      title: "Kernwoorden / tags",
      desc: "5-10 relevante tags die de lading dekken.",
      tag: "Extra",
      prompt: "**Kernwoorden / tags**: Geef 5 tot 10 relevante kernwoorden of tags die de lading van de meeting dekken, als een komma-gescheiden lijst."
    },
    "quotes": {
      title: "Belangrijke citaten",
      desc: "2-3 treffende citaten van deelnemers.",
      tag: "Extra",
      prompt: "**Belangrijke citaten**: Selecteer 2 tot 3 treffende, letterlijke citaten van deelnemers en vermeld waar mogelijk wie het zei. Citeer alleen wat daadwerkelijk in het transcript staat."
    }
  },

  /* ---- AI prompt template ---- */
  "promptTemplate": function (language, headingList, sectionInstructions, transcript, opts) {
    opts = opts || {};
    const niveauMap = {
      simpel: "Schrijf op begrijpelijk niveau voor mensen zonder vakkennis. Gebruik korte zinnen en eenvoudige woorden; vermijd jargon.",
      middelbaar: "Schrijf op middelbaar schoolniveau. Toegankelijk maar niet simplistisch.",
      professioneel: "Schrijf professioneel en zakelijk. Geschikt voor een breed kantoorpubliek.",
      technisch: "Gebruik technisch vakjargon en gedetailleerde terminologie waar van toepassing.",
      expert: "Schrijf op directie- en expertenniveau. Hoge informatiedichtheid en strategisch taalgebruik."
    };
    const typeMap = {
      verslag: "Structureer als een formeel vergaderverslag met duidelijke kopjes per sectie.",
      blog: "Structureer als een informatieve blogpost met een inleiding, middenstuk en afronding.",
      verhaal: "Vertel als een samenhangend verhaal met vloeiende overgangen tussen onderdelen.",
      memo: "Structureer als een beknopte interne memo: kort, to the point en bullet-heavy.",
      email: "Structureer als een professionele e-mail update voor collega's of management.",
      presentatie: "Geef uitsluitend bulletpoints en kernboodschappen, geschikt voor presentatiedia's."
    };
    const lengteMap = {
      kort: "Houd de totale samenvatting beknopt: maximaal een halve A4-pagina.",
      standaard: "Gebruik een standaard lengte: volledig maar zonder onnodige herhaling.",
      uitgebreid: "Wees uitgebreid en gedetailleerd: neem alle relevante details op."
    };
    const registerMap = {
      informeel: "Gebruik informele aanspreekvormen: je / jij / jullie. Spreek de lezer direct aan.",
      neutraal: "Gebruik een neutrale, zakelijke schrijfstijl zonder directe aanspreekvorm.",
      formeel: "Gebruik formele aanspreekvormen: u / uw. Houd een formele toon aan."
    };
    const doelgroepMap = {
      team: "De samenvatting is bedoeld voor het directe team: neem operationele details op.",
      management: "De samenvatting is bedoeld voor management: focus op strategische uitkomsten en besluiten.",
      extern: "De samenvatting is bedoeld voor externe stakeholders: wees terughoudend met interne informatie.",
      klant: "De samenvatting is bedoeld voor een klant: professioneel, klantgericht en zonder intern jargon."
    };
    const opmaakMap = {
      auto: "",
      bullets: "Gebruik bij voorkeur bulletpoints en lijsten; minimaliseer lopende tekst.",
      paragrafen: "Schrijf in lopende tekst en paragrafen; vermijd opsommingstekens."
    };

    const extraRules = [
      niveauMap[opts.niveau] || niveauMap.professioneel,
      typeMap[opts.type] || typeMap.verslag,
      lengteMap[opts.lengte] || lengteMap.standaard,
      registerMap[opts.register] || registerMap.neutraal,
      doelgroepMap[opts.doelgroep] || doelgroepMap.team,
      opmaakMap[opts.opmaak] || "",
      opts.anoniem ? "Vervang alle persoonsnamen door anonieme aanduidingen: Medewerker 1, Medewerker 2, enz. Bewaar de nummering consistent door het gehele document." : "",
      opts.inclusievBron ? "Voeg bronverwijzingen toe in het format: [*direct citaat of context uit het transcript*]. Plaats deze NOOIT in de hoofdtekst; integreer ze enkel waar relevant met italic brackets." : ""
    ].filter(Boolean).map(r => "- " + r).join("\n");

    return `# EXPERT ADVISEUR VOOR MEETING SAMENVATTINGEN
Je bent een expert meeting-analist met 10+ jaar ervaring in het extraheren van waarde uit complexe discussies. Je bent precies, objectief en houd je aan feiten. Je verzint nooit informatie.

# KERNFOCUSPUNTEN
Extraheer ALLEEN:
- Concrete actiepunten met duidelijke eigenaren
- Definitieve besluiten en goedkeuringen
- Belangrijke risico's en knelpunten
- Strategische uitkomsten en impact

Verspreek NIET MEE:
- Achtergrondinfo en context zonder actie
- Algemene discussiepunten zonder besluit
- Anekdotes en off-topic opmerkingen
- Voorbijgaande speculaties

# RANDVOORWAARDEN
1. Wees altijd concreet: geen vaagheid of theoretische uitspraken
2. Traceer alles terug naar het transcript: niets verzinnen
3. Ontbrekende informatie: markeer EXPLICIET als 'Niet vermeld' of 'TBD'
4. Wijs eigenaar toe ZELFS als impliciet: gebruik rollen/afdelingen als namen ontbreken
5. Deadlines: zoek naar expliciete vermeldingen OF leid af uit context (bijv. "volgende week", "voor eind maand")

# SCHRIJFRICHTLIJNEN
${extraRules}

# TE BEHANDELEN SECTIES
Analyseer in deze volgorde:
${headingList || "- (Geen secties geselecteerd)"}

# INSTRUCTIES PER SECTIE
${sectionInstructions || ""}

# TAAL
Analyseer het transcript in elke taal, maar schrijf het eindresultaat UITSLUITEND in het ${language}.

# INPUT TRANSCRIPT
\`\`\`
${transcript || "[Plak hier je Teams-transcript]"}
\`\`\``;
  }
};
