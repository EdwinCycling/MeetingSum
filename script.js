/* =========================================================
   MeetSum – Teams Transcript Summarizer Helper
   ========================================================= */
(function () {
  "use strict";

  /* ---------- Section definitions ----------
     Each section has:
       id      – stable key used for localStorage
       title   – label shown to the user
       desc    – short description for the user
       tag     – optional badge ("Extra")
       def     – part of the default set?
       prompt  – instruction injected into the AI prompt when selected
  */
  /* ---------- Section IDs + defaults (content comes from lang files) ---------- */
  const SECTION_DEFS = [
    { id: "doel",          def: true  },
    { id: "hoofdpunten",   def: true  },
    { id: "beslissingen",  def: true  },
    { id: "actiepunten",   def: true  },
    { id: "parkeerplaats", def: true  },
    { id: "executive",     def: true  },
    { id: "slotzin",       def: false },
    { id: "details",       def: true  },
    { id: "verbeterpunten",def: false },
    { id: "goedpunten",    def: false },
    { id: "sentiment",     def: false },
    { id: "risicos",       def: false },
    { id: "tags",          def: false },
    { id: "quotes",        def: false }
  ];

  /* ---------- Context option IDs (only relevant when extra docs are uploaded) ----------
     These options tell the AI how to use the extra background documents
     (typically previous MeetSum summaries) relative to the current transcript.
     Content (title/desc/prompt) comes from the lang files. */
  const CONTEXT_OPTION_DEFS = [
    { id: "recap" },
    { id: "progress" },
    { id: "openActions" },
    { id: "decisions" },
    { id: "recurring" },
    { id: "deviations" }
  ];

  const MAX_EXTRA_DOCS = 3;
  const REQUIRED_SECTION_IDS = ["executive", "details"];
  const DEFAULT_TAGS = [
    "Project Alpha",
    "Sprint Review",
    "Financieel",
    "Technisch",
    "AI",
    "TeamMeeting",
    "Planning",
    "Risico",
    "Roadmap",
    "Brainstorm"
  ];

  const STORAGE_KEY = "meetsum.prefs.v1";
  const THEME_KEY   = "meetsum.theme";
  const UI_LANG_KEY = "meetsum.uilang";
  const COOKIE_NOTICE_KEY = "meetsum.cookieNotice.v1";
  const VERSION_FILE = "/version.json";
  let currentAppVersion = "1.260704.2";

  /* ---------- Output option defaults ---------- */
  const OUTPUT_DEFAULTS = {
    niveau:         "professioneel",
    type:           "verslag",
    lengte:         "standaard",
    register:       "neutraal",
    anoniem:        false,
    doelgroep:      "team",
    opmaak:         "auto",
    inclusievBron:  false
  };

  const ANALYSIS_DEFAULTS = {
    mode: "sections",
    option: "open-questions",
    tab: "reports"
  };

  const ANALYSIS_OPTION_DEFS = [
    {
      id: "bcg-matrix",
      group: "reports",
      titleNl: "BCG Groei-Aandeel Matrix",
      titleEn: "BCG Growth-Share Matrix",
      descNl: "Deel producten of diensten in: Stars, Cash Cows, Question Marks of Dogs.",
      descEn: "Classify offerings into Stars, Cash Cows, Question Marks, or Dogs.",
      promptNl: "BCG MATRIX: Analyseer de besproken producten of diensten en deel ze gemotiveerd in binnen de vier BCG-kwadranten: Stars, Cash Cows, Question Marks of Dogs, gebaseerd op de discussie over groei en marktaandeel. Gebruik een tabel met kolommen: Item | Kwadrant | Onderbouwing | Aanbevolen actie.",
      promptEn: "BCG MATRIX: Analyze the discussed products or services and classify them into Stars, Cash Cows, Question Marks, or Dogs based on growth and market share. Use a table with: Item | Quadrant | Rationale | Recommended action."
    },
    {
      id: "mckinsey-7s",
      group: "reports",
      titleNl: "McKinsey 7S Assessment",
      titleEn: "McKinsey 7S Assessment",
      descNl: "Toets de alignment tussen strategie, structuur, systemen en mensfactoren.",
      descEn: "Assess alignment of strategy, structure, systems, and people factors.",
      promptNl: "MCKINSEY 7S AUDIT: Beoordeel de besproken plannen op de zeven 7S-elementen (Strategy, Structure, Systems, Shared Values, Style, Staff, Skills). Benoem frictie tussen harde en zachte factoren en geef concrete interventies.",
      promptEn: "MCKINSEY 7S AUDIT: Evaluate the discussed plans across Strategy, Structure, Systems, Shared Values, Style, Staff, and Skills. Identify hard/soft misalignments and propose concrete interventions."
    },
    {
      id: "swot",
      group: "reports",
      titleNl: "SWOT Analyse",
      titleEn: "SWOT Analysis",
      descNl: "Structureer sterktes, zwaktes, kansen en bedreigingen uit de meeting.",
      descEn: "Structure strengths, weaknesses, opportunities, and threats from the meeting.",
      promptNl: "SWOT-ANALYSE: Maak een complete SWOT-matrix met interne factoren (Sterktes, Zwaktes) en externe factoren (Kansen, Bedreigingen) op basis van het transcript. Geef per item impact en urgentie.",
      promptEn: "SWOT ANALYSIS: Build a full SWOT matrix with internal factors (Strengths, Weaknesses) and external factors (Opportunities, Threats) from the transcript. Include impact and urgency per item."
    },
    {
      id: "porter-five-forces",
      group: "reports",
      titleNl: "Porter Vijfkrachtenmodel",
      titleEn: "Porter Five Forces",
      descNl: "Analyseer concurrentiedruk en marktaantrekkelijkheid.",
      descEn: "Assess competitive pressure and market attractiveness.",
      promptNl: "PORTER'S FIVE FORCES: Analyseer de besproken marktpositie via leverancierskracht, afnemerskracht, substituten, nieuwe toetreders en interne concurrentie. Sluit af met strategisch advies.",
      promptEn: "PORTER'S FIVE FORCES: Analyze market position via supplier power, buyer power, substitutes, new entrants, and competitive rivalry. Conclude with strategic advice."
    },
    {
      id: "pestel",
      group: "reports",
      titleNl: "PESTEL Omgevingsanalyse",
      titleEn: "PESTEL Environment Analysis",
      descNl: "Breng macrofactoren in kaart die impact hebben op het project.",
      descEn: "Map macro-environment factors impacting the project.",
      promptNl: "PESTEL-ANALYSE: Categoriseer relevante macrofactoren onder Politiek, Economisch, Sociaal-cultureel, Technologisch, Ecologisch en Legaal. Geef per factor de implicatie voor keuzes uit de meeting.",
      promptEn: "PESTEL ANALYSIS: Categorize relevant macro factors under Political, Economic, Social, Technological, Environmental, and Legal. For each factor, state implications for meeting decisions."
    },
    {
      id: "blue-ocean",
      group: "reports",
      titleNl: "Blue Ocean Audit",
      titleEn: "Blue Ocean Audit",
      descNl: "Toets of de besproken richting leidt tot waarde-innovatie.",
      descEn: "Evaluate whether the direction creates value innovation.",
      promptNl: "BLUE OCEAN EVALUATIE: Beoordeel in hoeverre de besproken strategie bijdraagt aan waarde-innovatie. Gebruik het ERRC-model: Eliminate, Reduce, Raise, Create.",
      promptEn: "BLUE OCEAN EVALUATION: Assess how the discussed strategy contributes to value innovation. Use the ERRC framework: Eliminate, Reduce, Raise, Create."
    },
    {
      id: "value-chain",
      group: "reports",
      titleNl: "Porter Waardeketen",
      titleEn: "Porter Value Chain",
      descNl: "Identificeer waar de meeste waarde of kosten ontstaan.",
      descEn: "Identify where the most value or cost is created.",
      promptNl: "VALUE CHAIN ANALYSE: Breng primaire en ondersteunende activiteiten in kaart die in de meeting zijn genoemd. Benoem per activiteit waardehefboom, bottleneck en optimalisatiekans.",
      promptEn: "VALUE CHAIN ANALYSIS: Map primary and support activities mentioned in the meeting. For each activity, describe value lever, bottleneck, and optimization opportunity."
    },
    {
      id: "mckinsey-horizons",
      group: "reports",
      titleNl: "McKinsey 3 Horizons",
      titleEn: "McKinsey Three Horizons",
      descNl: "Deel initiatieven in korte, middellange en lange termijn.",
      descEn: "Classify initiatives into short-, mid-, and long-term horizons.",
      promptNl: "MCKINSEY HORIZONS: Deel besproken initiatieven in Horizon 1, 2 en 3. Licht toe waarom en noem afhankelijkheden en investeringslogica.",
      promptEn: "MCKINSEY HORIZONS: Place discussed initiatives into Horizon 1, 2, and 3. Explain rationale, dependencies, and investment logic."
    },
    {
      id: "ansoff",
      group: "reports",
      titleNl: "Ansoff Matrix",
      titleEn: "Ansoff Matrix",
      descNl: "Bepaal dominante groeistrategie uit de meeting.",
      descEn: "Determine dominant growth strategy from the meeting.",
      promptNl: "ANSOFF MATRIX: Classificeer de besproken groeirichting als Marktpenetratie, Productontwikkeling, Marktontwikkeling of Diversificatie. Motiveer en noem risico's.",
      promptEn: "ANSOFF MATRIX: Classify the discussed growth direction as Market Penetration, Product Development, Market Development, or Diversification. Justify and include risks."
    },
    {
      id: "ge-mckinsey",
      group: "reports",
      titleNl: "GE-McKinsey Portfolio",
      titleEn: "GE-McKinsey Portfolio",
      descNl: "Evalueer units op marktaantrekkelijkheid versus concurrentiekracht.",
      descEn: "Evaluate units by market attractiveness versus competitive strength.",
      promptNl: "GE-MCKINSEY MATRIX: Evalueer besproken business units op Marktaantrekkelijkheid en Concurrentiekracht en adviseer: Investeren/Groeien, Selectief beheren, of Oogsten/Desinvesteren.",
      promptEn: "GE-MCKINSEY MATRIX: Evaluate discussed business units on Market Attractiveness and Competitive Strength and recommend: Invest/Grow, Selective Management, or Harvest/Divest."
    },
    {
      id: "mece-issue-tree",
      group: "reports",
      titleNl: "MECE Issue Tree",
      titleEn: "MECE Issue Tree",
      descNl: "Breek het kernprobleem op in elkaar uitsluitende deelproblemen.",
      descEn: "Break the core problem into mutually exclusive issue branches.",
      promptNl: "MECE ISSUE TREE: Breek het hoofdprobleem uit de meeting op in een MECE-structuur. Toon een boomstructuur met hoofdvraag, deelvragen en hypothesen.",
      promptEn: "MECE ISSUE TREE: Decompose the meeting's core problem into a MECE structure. Present a tree with main question, sub-questions, and hypotheses."
    },
    {
      id: "sipoc",
      group: "reports",
      titleNl: "SIPOC Procesmap",
      titleEn: "SIPOC Process Map",
      descNl: "Vertaal operationele discussie naar leveranciers-input-proces-output-klant.",
      descEn: "Translate operations discussion into supplier-input-process-output-customer map.",
      promptNl: "SIPOC PROCESS MAP: Maak een beknopt SIPOC-overzicht met Suppliers, Inputs, Process, Outputs en Customers op basis van de besproken workflow.",
      promptEn: "SIPOC PROCESS MAP: Create a concise SIPOC overview with Suppliers, Inputs, Process, Outputs, and Customers based on the discussed workflow."
    },
    {
      id: "ishikawa-5whys",
      group: "reports",
      titleNl: "Ishikawa + 5 Whys",
      titleEn: "Ishikawa + 5 Whys",
      descNl: "Analyseer grondoorzaken van het besproken kernprobleem.",
      descEn: "Analyze root causes of the discussed core problem.",
      promptNl: "ISHIKAWA + 5 WHYS: Structureer oorzaken volgens Mens, Methode, Machine, Materiaal, Meting en Milieu. Pas 5 Whys toe op de meest kritieke oorzaak.",
      promptEn: "ISHIKAWA + 5 WHYS: Structure causes by Man, Method, Machine, Material, Measurement, and Environment. Apply 5 Whys to the most critical cause."
    },
    {
      id: "kepner-tregoe",
      group: "reports",
      titleNl: "Kepner-Tregoe Beslissingsanalyse",
      titleEn: "Kepner-Tregoe Decision Analysis",
      descNl: "Vergelijk alternatieven op Musts, Wants en risico's.",
      descEn: "Compare alternatives across Musts, Wants, and risks.",
      promptNl: "KEPNER-TREGOE: Evalueer opties uit de meeting via Musts en Wants. Beoordeel risico's per optie en sluit af met voorkeursoptie + onderbouwing.",
      promptEn: "KEPNER-TREGOE: Evaluate meeting options using Musts and Wants. Assess risks per option and conclude with preferred option and rationale."
    },
    {
      id: "fmea",
      group: "reports",
      titleNl: "FMEA Risico-prioritering",
      titleEn: "FMEA Risk Prioritization",
      descNl: "Schat Severity, Occurrence en Detection per faalwijze.",
      descEn: "Estimate Severity, Occurrence, and Detection per failure mode.",
      promptNl: "FMEA RISICO-ANALYSE: Breng faalwijzen in kaart en schat Severity, Occurrence en Detection om een RPN te bepalen. Rangschik top-risico's en noem acties.",
      promptEn: "FMEA RISK ANALYSIS: Map failure modes and estimate Severity, Occurrence, and Detection to derive RPN. Rank top risks and propose actions."
    },
    {
      id: "mckinsey-influence",
      group: "reports",
      titleNl: "McKinsey Influence Model",
      titleEn: "McKinsey Influence Model",
      descNl: "Toets veranderkans via rolmodellen, begrip, systemen en vaardigheden.",
      descEn: "Assess change readiness via role modeling, understanding, systems, and skills.",
      promptNl: "INFLUENCE MODEL AUDIT: Beoordeel de besproken verandering via rolmodellen, begrip, systemen en vaardigheden. Benoem waar adoptie stokt en welke interventies nodig zijn.",
      promptEn: "INFLUENCE MODEL AUDIT: Assess the discussed change via role modeling, understanding, systems, and skills. Identify adoption blockers and required interventions."
    },
    {
      id: "adkar",
      group: "reports",
      titleNl: "ADKAR Verandermodel",
      titleEn: "ADKAR Change Model",
      descNl: "Breng de grootste veranderbarriere per ADKAR-fase in kaart.",
      descEn: "Identify the biggest barrier across ADKAR stages.",
      promptNl: "ADKAR ANALYSE: Evalueer Awareness, Desire, Knowledge, Ability en Reinforcement op basis van de meeting. Identificeer de grootste barriere en acties.",
      promptEn: "ADKAR ANALYSIS: Evaluate Awareness, Desire, Knowledge, Ability, and Reinforcement from the meeting. Identify the biggest barrier and actions."
    },
    {
      id: "kotter-8",
      group: "reports",
      titleNl: "Kotter 8-stappen Audit",
      titleEn: "Kotter 8-Step Audit",
      descNl: "Bepaal huidige fase in het verandertraject en ontbrekende stappen.",
      descEn: "Determine current change phase and missing steps.",
      promptNl: "KOTTER 8-STAPPEN: Plaats de organisatie in Kotter's veranderstappen en benoem welke volgende stap nu cruciaal is.",
      promptEn: "KOTTER 8 STEPS: Place the organization within Kotter's change steps and identify the most critical next step."
    },
    {
      id: "stakeholder-power-interest",
      group: "reports",
      titleNl: "Stakeholder Macht-Interesse Matrix",
      titleEn: "Stakeholder Power-Interest Matrix",
      descNl: "Classificeer stakeholders op macht en betrokkenheid.",
      descEn: "Classify stakeholders by power and interest.",
      promptNl: "STAKEHOLDER MACHT-INTERESSE: Deel stakeholders in: Actief managen, Tevreden houden, Geinformeerd houden, Monitoren. Geef per stakeholder aanpak.",
      promptEn: "STAKEHOLDER POWER-INTEREST: Classify stakeholders into Manage Closely, Keep Satisfied, Keep Informed, or Monitor. Provide handling approach per stakeholder."
    },
    {
      id: "cultural-web",
      group: "reports",
      titleNl: "Cultureel Web Assessment",
      titleEn: "Cultural Web Assessment",
      descNl: "Analyseer cultuurpatronen en veranderbarrieres.",
      descEn: "Analyze cultural patterns and change barriers.",
      promptNl: "CULTUREEL WEB: Analyseer paradigma, rituelen, verhalen, symbolen, machtstructuren, organisatiestructuren en controlesystemen uit de meeting.",
      promptEn: "CULTURAL WEB: Analyze paradigm, routines, stories, symbols, power structures, organizational structures, and control systems from the meeting."
    },
    {
      id: "kano",
      group: "reports",
      titleNl: "Kano Klantbehoefte Model",
      titleEn: "Kano Customer Needs Model",
      descNl: "Prioriteer features op impact op klanttevredenheid.",
      descEn: "Prioritize features by customer satisfaction impact.",
      promptNl: "KANO MODEL: Classificeer besproken klantwensen als Must-be, Performance of Delighter. Benoem implicatie voor roadmap-prioritering.",
      promptEn: "KANO MODEL: Classify discussed customer needs as Must-be, Performance, or Delighter. Explain roadmap prioritization implications."
    },
    {
      id: "moscow",
      group: "reports",
      titleNl: "MoSCoW Prioriteringsmatrix",
      titleEn: "MoSCoW Prioritization Matrix",
      descNl: "Verdeel scope in Must/Should/Could/Won't.",
      descEn: "Split scope into Must/Should/Could/Won't.",
      promptNl: "MOSCOW MATRIX: Verdeel besproken wensen en taken in Must, Should, Could en Won't. Geef korte motivatie per item.",
      promptEn: "MOSCOW MATRIX: Categorize discussed requests and tasks into Must, Should, Could, and Won't. Include a short rationale per item."
    },
    {
      id: "customer-journey",
      group: "reports",
      titleNl: "Customer Journey Pain-Point Map",
      titleEn: "Customer Journey Pain-Point Map",
      descNl: "Maak fricties en kansen zichtbaar over de klantreis.",
      descEn: "Map friction points and opportunities along the customer journey.",
      promptNl: "CUSTOMER JOURNEY MAP: Breng besproken klantmomenten in kaart over Bewustwording, Overweging, Aankoop, Gebruik en Service. Markeer pain points en kansen.",
      promptEn: "CUSTOMER JOURNEY MAP: Map discussed customer moments across Awareness, Consideration, Purchase, Use, and Service. Highlight pain points and opportunities."
    },
    {
      id: "trl",
      group: "reports",
      titleNl: "Technology Readiness Level",
      titleEn: "Technology Readiness Level",
      descNl: "Schat technologische volwassenheid op TRL 1-9.",
      descEn: "Estimate technology maturity on TRL 1-9.",
      promptNl: "TRL SCORE: Beoordeel de besproken technologie op TRL 1 t/m 9 met onderbouwing en noem wat nodig is voor de volgende TRL-stap.",
      promptEn: "TRL SCORE: Assess the discussed technology on TRL 1 to 9 with rationale and state what is required to reach the next TRL stage."
    },
    {
      id: "cost-benefit-roi",
      group: "reports",
      titleNl: "Kosten-Baten & ROI",
      titleEn: "Cost-Benefit & ROI",
      descNl: "Maak impactinschatting van besluiten inclusief terugverdientijd.",
      descEn: "Estimate impact of decisions including payback.",
      promptNl: "KOSTEN-BATEN & ROI: Maak een kwalitatieve en waar mogelijk kwantitatieve inschatting van kosten, baten, ROI en terugverdientijd van voorgestelde besluiten.",
      promptEn: "COST-BENEFIT & ROI: Provide a qualitative and, where possible, quantitative estimate of costs, benefits, ROI, and payback time for proposed decisions."
    },
    {
      id: "open-questions",
      group: "other",
      titleNl: "Open Vragen & Kennisgaten",
      titleEn: "Open Questions & Knowledge Gaps",
      descNl: "Onbeantwoorde discussiepunten en ontbrekende informatie.",
      descEn: "Unresolved discussion points and missing information.",
      promptNl: "OPEN VRAGEN & KENNISGATEN: Breng discussiepunten in kaart die onbeantwoord bleven en benoem welke opheldering, data of onderzoek nog nodig is. Prioriteer op impact.",
      promptEn: "OPEN QUESTIONS & KNOWLEDGE GAPS: Identify unresolved discussion points and specify what clarification, data, or research is still needed. Prioritize by impact."
    },
    {
      id: "consensus-friction",
      group: "other",
      titleNl: "Consensus & Frictie",
      titleEn: "Consensus & Friction",
      descNl: "Waar zat men snel op een lijn en waar ontstond discussie.",
      descEn: "Where participants aligned quickly and where friction emerged.",
      promptNl: "CONSENSUS & FRICTIE: Analyseer per dossier waar snelle alignment ontstond en waar discussie, twijfel of conflict zichtbaar was. Geef een korte oorzaak per frictiepunt.",
      promptEn: "CONSENSUS & FRICTION: Analyze per topic where alignment emerged quickly and where debate, doubt, or conflict appeared. Give a short root cause per friction point."
    },
    {
      id: "raci",
      group: "other",
      titleNl: "RACI Rollenverdeling",
      titleEn: "RACI Role Mapping",
      descNl: "Vertaal besproken taken naar Responsible, Accountable, Consulted, Informed.",
      descEn: "Translate discussed tasks into Responsible, Accountable, Consulted, Informed.",
      promptNl: "RACI MATRIX: Zet besproken projecten en taken om in een RACI-tabel met kolommen Activiteit | Responsible | Accountable | Consulted | Informed. Gebruik 'Onbekend' waar nodig.",
      promptEn: "RACI MATRIX: Convert discussed projects and tasks into a RACI table with Activity | Responsible | Accountable | Consulted | Informed. Use 'Unknown' if needed."
    },
    {
      id: "timeline",
      group: "other",
      titleNl: "Chronologische Tijdlijn",
      titleEn: "Chronological Timeline",
      descNl: "Extraheer datums, deadlines en fasen in tijdsvolgorde.",
      descEn: "Extract dates, deadlines, and phases in chronological order.",
      promptNl: "CHRONOLOGISCHE TIJDLIJN: Extraheer alle genoemde datums, deadlines, mijlpalen en fasen en zet ze in een chronologische projecttijdlijn met eventuele afhankelijkheden.",
      promptEn: "CHRONOLOGICAL TIMELINE: Extract all mentioned dates, deadlines, milestones, and phases and present them in chronological order including dependencies if mentioned."
    },
    {
      id: "hidden-ideas",
      group: "other",
      titleNl: "Onontdekte Ideeen & Kansen",
      titleEn: "Unrealized Ideas & Opportunities",
      descNl: "Ideeen die genoemd zijn maar nog geen besluit werden.",
      descEn: "Ideas mentioned but not turned into decisions.",
      promptNl: "ONONTDEKTE IDEEEN & KANSEN: Breng innovatieve suggesties of brainstorm-ideeen in kaart die wel genoemd zijn maar nog niet formeel besloten of ingepland zijn.",
      promptEn: "UNREALIZED IDEAS & OPPORTUNITIES: Map innovative suggestions or brainstorm ideas that were mentioned but not yet formalized into decisions or plans."
    },
    {
      id: "voice-of-customer",
      group: "other",
      titleNl: "Voice of the Customer",
      titleEn: "Voice of the Customer",
      descNl: "Bundel klantbehoeften, klachten, wensen en feedback uit het gesprek.",
      descEn: "Aggregate customer needs, complaints, wishes, and feedback.",
      promptNl: "VOICE OF THE CUSTOMER: Extraheer expliciete of impliciete klantbehoeften, klachten, wensen en feedback uit het transcript en groepeer ze op thema.",
      promptEn: "VOICE OF THE CUSTOMER: Extract explicit and implicit customer needs, complaints, wishes, and feedback from the transcript and group them by theme."
    },
    {
      id: "communication-dynamics",
      group: "other",
      titleNl: "Communicatiedynamiek",
      titleEn: "Communication Dynamics",
      descNl: "Analyseer sprekersaandeel, interactiepatronen en toon.",
      descEn: "Analyze speaking share, interaction patterns, and tone.",
      promptNl: "COMMUNICATIEDYNAMIEK: Analyseer de interactie tussen sprekers, benoem wie het gesprek domineerde en typeer de algemene toon (sturend, explorerend, defensief).",
      promptEn: "COMMUNICATION DYNAMICS: Analyze interaction between speakers, identify who dominated the discussion, and characterize the overall tone (directive, exploratory, defensive)."
    },
    {
      id: "risk-mitigation",
      group: "other",
      titleNl: "Risico- & Mitigatiematrix",
      titleEn: "Risk & Mitigation Matrix",
      descNl: "Koppel besproken risico's direct aan tegenmaatregelen.",
      descEn: "Link discussed risks directly to mitigation actions.",
      promptNl: "RISICO- & MITIGATIEMATRIX: Maak een matrix met risico, impact, kans, eigenaar en voorgestelde mitigatie op basis van expliciet genoemde of sterk impliciete showstoppers.",
      promptEn: "RISK & MITIGATION MATRIX: Build a matrix with risk, impact, likelihood, owner, and proposed mitigation based on explicitly mentioned or strongly implied showstoppers."
    },
    {
      id: "strategic-alignment",
      group: "other",
      titleNl: "Strategische Alignment",
      titleEn: "Strategic Alignment",
      descNl: "Toets bijdrage aan organisatiedoelen, KPI's of OKR's.",
      descEn: "Assess contribution to organizational goals, KPIs, or OKRs.",
      promptNl: "STRATEGISCHE ALIGNMENT: Beoordeel in hoeverre besproken onderwerpen en besluiten bijdragen aan grotere organisatiedoelen, KPI's of OKR's. Benoem ook misalignment.",
      promptEn: "STRATEGIC ALIGNMENT: Assess how discussed topics and decisions contribute to broader organizational goals, KPIs, or OKRs. Also identify misalignment."
    },
    {
      id: "previous-agreements",
      group: "other",
      titleNl: "Eerdere Afspraken Check",
      titleEn: "Previous Agreements Check",
      descNl: "Controleer voortgang op oude actiepunten met gekoppelde documenten.",
      descEn: "Check progress on old action items using linked documents.",
      promptNl: "EERDERE AFSPRAKEN CHECK: Vergelijk de huidige meeting met gekoppelde historische documenten en controleer of oude actiepunten, deadlines en besluiten voortgang tonen.",
      promptEn: "PREVIOUS AGREEMENTS CHECK: Compare the current meeting with linked historical documents and verify progress on previous action items, deadlines, and decisions."
    },
    {
      id: "followup",
      group: "other",
      titleNl: "Vervolgvragen",
      titleEn: "Follow-up Questions",
      descNl: "Genereer 5 scherpe vragen voor verdieping en besluitvorming.",
      descEn: "Generate 5 sharp questions for deeper analysis and decision making.",
      promptNl: "VERVOLGVRAGEN: Formuleer exact 5 sterke vervolgvragen op basis van het transcript. Voeg per vraag toe: relevantie, beoogd besluit/inzicht en aanleiding uit het gesprek.",
      promptEn: "FOLLOW-UP QUESTIONS: Formulate exactly 5 strong follow-up questions based on the transcript. For each: relevance, expected decision/insight, and trigger from the discussion."
    },
    {
      id: "quiz",
      group: "other",
      titleNl: "Quiz",
      titleEn: "Quiz",
      descNl: "10 vragen met antwoordopties, uitleg, score en eindrapport.",
      descEn: "10 questions with answer options, explanations, score, and final report.",
      promptNl: "QUIZ: Maak exact 10 vragen over de transcriptinhoud met per vraag antwoordopties A t/m D. Geef direct na elke vraag het juiste antwoord met korte uitleg en sluit af met scoreformat + kennisrapport.",
      promptEn: "QUIZ: Create exactly 10 questions about the transcript with answer options A through D. After each question provide the correct answer with short explanation, then end with a score format and knowledge report."
    },
    {
      id: "dashboard",
      group: "other",
      titleNl: "Dashboard",
      titleEn: "Dashboard",
      descNl: "Genereer een interactieve HTML-pagina op basis van het transcript.",
      descEn: "Generate an interactive HTML page based on the transcript.",
      promptNl: "DASHBOARD: Genereer een complete interactieve HTML-pagina in 1 codeblok zonder extra tekst. Gebruik pure HTML/CSS/JS (geen externe libraries) met secties voor besluiten, actiepunten, risico's, inzichten en filters/tabs.",
      promptEn: "DASHBOARD: Generate a complete interactive HTML page in a single code block and no extra text. Use pure HTML/CSS/JS (no external libraries) with sections for decisions, actions, risks, insights, and filters/tabs."
    }
  ];

  /* ---------- i18n ---------- */
  let currentLangCode = "nl"; // resolved in init()

  function getLang() {
    return currentLangCode === "en" ? window.LANG_EN : window.LANG_NL;
  }

  function t(key, ...args) {
    const lang = getLang();
    let val = lang[key];
    if (val === undefined) val = (window.LANG_NL || {})[key]; // NL fallback
    if (val === undefined) return key;
    return typeof val === "function" ? val(...args) : val;
  }

  function getSections() {
    const sectionLang = getLang().sections || {};
    return SECTION_DEFS.map((def) => ({ ...def, ...(sectionLang[def.id] || {}) }));
  }

  function getSectionMap() {
    return Object.fromEntries(getSections().map((s) => [s.id, s]));
  }

  function getAnalysisOptions() {
    const isEn = currentLangCode === "en";
    return ANALYSIS_OPTION_DEFS.map((opt) => ({
      id: opt.id,
      group: opt.group,
      title: isEn ? opt.titleEn : opt.titleNl,
      desc: isEn ? opt.descEn : opt.descNl,
      prompt: isEn ? opt.promptEn : opt.promptNl
    }));
  }

  function getAnalysisOptionById(id) {
    return ANALYSIS_OPTION_DEFS.find((opt) => opt.id === id) || null;
  }

  function getAnalysisPromptCopy(optionId, targetLangValue) {
    const def = getAnalysisOptionById(optionId) || getAnalysisOptionById(ANALYSIS_DEFAULTS.option);
    const isDutchTarget = targetLangValue === "Nederlands";
    if (!def) return { title: "Analyse", prompt: "Analyseer het transcript." };
    return {
      title: isDutchTarget ? def.titleNl : def.titleEn,
      prompt: isDutchTarget ? def.promptNl : def.promptEn,
      group: def.group
    };
  }

  function getAnalysisStyleGuide(optionId, targetLangValue) {
    const copy = getAnalysisPromptCopy(optionId, targetLangValue);
    const isDutchTarget = targetLangValue === "Nederlands";
    if (optionId === "dashboard") {
      return isDutchTarget
        ? "OUTPUTFORMAT: Lever uitsluitend 1 geldig HTML-codeblok (zonder extra tekst erboven of eronder) met duidelijke secties, interactieve filters/tabs en zakelijke visualisaties."
        : "OUTPUT FORMAT: Return exactly one valid HTML code block (no text before or after) with clear sections, interactive filters/tabs, and business-oriented visualizations.";
    }
    if (optionId === "quiz") {
      return isDutchTarget
        ? "OUTPUTFORMAT: Gebruik een vaste quizstructuur met 10 genummerde vragen, antwoordopties A-D, direct antwoord met korte uitleg, en een eindscoreblok."
        : "OUTPUT FORMAT: Use a fixed quiz structure with 10 numbered questions, options A-D, immediate answer plus short explanation, and a final score block.";
    }
    if (optionId === "raci") {
      return isDutchTarget
        ? "OUTPUTFORMAT: Gebruik primair een duidelijke Markdown-tabel voor de RACI-matrix en voeg daarna een korte toelichting met risico's of gaten toe."
        : "OUTPUT FORMAT: Use a clear Markdown table for the RACI matrix first, followed by a short narrative on risks or gaps.";
    }
    if (optionId === "timeline") {
      return isDutchTarget
        ? "OUTPUTFORMAT: Lever een chronologische lijst of tabel met datum, gebeurtenis, eigenaar en afhankelijkheden waar bekend."
        : "OUTPUT FORMAT: Return a chronological list or table with date, event, owner, and dependencies where known.";
    }
    if (copy.group === "reports") {
      return isDutchTarget
        ? "SCHRIJFSTIJL: Formeel rapportniveau. Gebruik heldere koppen, een executive samenvatting, kernanalyse, aanbevelingen en vervolgstappen."
        : "WRITING STYLE: Formal report level. Use clear headings, executive summary, core analysis, recommendations, and next steps.";
    }
    return isDutchTarget
      ? "SCHRIJFSTIJL: Krachtig analytisch. Gebruik korte koppen, concrete bullets en duidelijke conclusies zonder herhaling."
      : "WRITING STYLE: Crisp analytical style. Use short headings, concrete bullets, and clear conclusions without repetition.";
  }

  function getAnalysisOptionMap() {
    return Object.fromEntries(getAnalysisOptions().map((opt) => [opt.id, opt]));
  }

  /* ---------- Context options (extra documents) ---------- */
  function getContextOptions() {
    const ctxLang = getLang().contextOptions || {};
    return CONTEXT_OPTION_DEFS.map((def) => ({ ...def, ...(ctxLang[def.id] || {}) }));
  }

  function getContextOptionMap() {
    return Object.fromEntries(getContextOptions().map((o) => [o.id, o]));
  }

  function anyContextSelected() {
    const co = prefs.contextOptions || {};
    return CONTEXT_OPTION_DEFS.some((o) => co[o.id]);
  }

  function getOutputOptionSummary() {
    const oo = prefs.outputOptions || OUTPUT_DEFAULTS;
    const boolText = (value) => value ? t("common.enabled") : t("common.disabled");
    return [
      { label: t("step3.niveau.label"), value: t("step3.niveau." + oo.niveau) },
      { label: t("step3.type.label"), value: t("step3.type." + oo.type) },
      { label: t("step3.lengte.label"), value: t("step3.lengte." + oo.lengte) },
      { label: t("step3.register.label"), value: t("step3.register." + oo.register) },
      { label: t("step3.doelgroep.label"), value: t("step3.doelgroep." + oo.doelgroep) },
      { label: t("step3.opmaak.label"), value: t("step3.opmaak." + oo.opmaak) },
      { label: t("step3.anoniem.label"), value: boolText(!!oo.anoniem) },
      { label: t("step3.inclusievBron.label"), value: boolText(!!oo.inclusievBron) }
    ];
  }

  function setBodyFrozen(isFrozen) {
    document.body.classList.toggle("modal-open", !!isFrozen);
  }

  function canUnfreezeBody() {
    const ids = [
      "infoModal",
      "cookieNotice",
      "confirmModal",
      "pinModal",
      "installExplainModal",
      "scannerLinkModal",
      "scannerDetailsModal",
      "introVideoModal"
    ];
    return ids.every((id) => {
      const el = document.getElementById(id);
      return !el || el.hidden;
    });
  }

  function requestServiceWorkerActivation(registration) {
    const waiting = registration && registration.waiting;
    if (waiting) waiting.postMessage({ type: "SKIP_WAITING" });
  }

  /* ---------- applyTranslations – sets every visible UI string ---------- */
  function applyTranslations() {
    document.documentElement.lang = t("html.lang");

    const set = (sel, key) => {
      const el = document.querySelector(sel);
      if (el) el.textContent = t(key);
    };
    const setAttr = (sel, attr, key) => {
      const el = document.querySelector(sel);
      if (el) el.setAttribute(attr, t(key));
    };

    // Header
    set("#installBtn span",  "install.label");
    setAttr("#installBtn",   "title",      "install.title");
    setAttr("#installBtn",   "aria-label", "install.ariaLabel");
    setAttr("#themeToggle",  "aria-label", "theme.ariaLabel");
    setAttr("#themeToggle",  "title",      "theme.title");
    setAttr("#uiLangSelect", "aria-label", "uiLang.ariaLabel");

    // Hero
    set(".hero .pill", "hero.pill");
    const h1 = document.querySelector(".hero h1");
    if (h1) {
      const accentSpan = h1.querySelector(".gradient-text");
      if (accentSpan) accentSpan.textContent = t("hero.h1.accent");
      const textNode = [...h1.childNodes].find((n) => n.nodeType === Node.TEXT_NODE);
      if (textNode) textNode.textContent = t("hero.h1") + "\n";
    }
    set(".hero-sub", "hero.sub");
    const ctaBtns = document.querySelectorAll(".hero-cta a");
    if (ctaBtns[0]) ctaBtns[0].textContent = t("hero.cta.start");
    if (ctaBtns[1]) ctaBtns[1].textContent = t("hero.cta.sections");
    const badges = document.querySelectorAll(".hero-badges span");
    if (badges[0]) badges[0].textContent = t("hero.badge.local");
    if (badges[1]) badges[1].textContent = t("hero.badge.langs");
    if (badges[2]) badges[2].textContent = t("hero.badge.prefs");

    // Step 1
    set("#step-1 h2",                  "step1.title");
    set("#step-1 .step-desc",          "step1.desc");
    set("label[for='transcript']",     "step1.label.transcript");
    set("#dropStrongText",             "step1.drop.strong");
    set("#dropOrText",                 "step1.drop.or");
    set("#browseBtn",                  "step1.drop.browse");
    set("#dropHintText",               "step1.drop.hint");
    setAttr("#transcript", "placeholder", "step1.placeholder.transcript");
    set("#clearTranscript",            "step1.clear");
    set("label[for='language']",       "step1.label.summaryLang");

    // Step 1 – extra context documents
    set("#extraDocsSummaryText", "extra.summary");
    set("#extraDocsIntro",       "extra.intro");
    set("#extraDropStrong",      "extra.drop.strong");
    set("#extraDropOr",          "step1.drop.or");
    set("#extraBrowseBtn",       "step1.drop.browse");
    set("#extraDropHint",        "extra.drop.hint");

    // Summary language select options
    const langOptKeys = ["lang.option.nl","lang.option.en","lang.option.de","lang.option.fr","lang.option.es"];
    const summarySelect = document.getElementById("language");
    if (summarySelect) {
      [...summarySelect.options].forEach((opt, i) => {
        if (langOptKeys[i]) opt.text = t(langOptKeys[i]);
      });
    }

    // Step 2
    set("#step2Title",            "step2.title");
    set("#step2Desc",             "step2.desc");
    set("#modeSectionsBtn",       "step2.mode.sections");
    set("#modeAnalysisBtn",       "step2.mode.analysis");
    set("#analysisIntro",         "step2.analysis.intro");
    set("#analysisTabReports",    "step2.analysis.tab.reports");
    set("#analysisTabOther",      "step2.analysis.tab.other");
    set("#analysisReportsTitle",  "step2.analysis.group.reports.title");
    set("#analysisReportsDesc",   "step2.analysis.group.reports.desc");
    set("#analysisOtherTitle",    "step2.analysis.group.other.title");
    set("#analysisOtherDesc",     "step2.analysis.group.other.desc");
    set("#selectAll",             "step2.selectAll");
    set("#selectNone",            "step2.selectNone");
    set("#selectDefault",         "step2.selectDefault");
    set("#resetOrder",            "step2.resetOrder");
    set(".sections-drag-hint",    "step2.dragHint");

    // Step 2 – context options block
    set("#contextOptionsBadge", "extra.badge");
    set("#contextOptionsTitle", "ctx.title");
    set("#contextOptionsDesc",  "ctx.desc");

    // Step 3 – output options
    set("#step3-h2",              "step3.title");
    set("#step3-desc",            "step3.desc");
    set("#optNiveauLabel",        "step3.niveau.label");
    set("#optTypeLabel",          "step3.type.label");
    set("#optLengteLabel",        "step3.lengte.label");
    set("#optRegisterLabel",      "step3.register.label");
    set("#optDoelgroepLabel",     "step3.doelgroep.label");
    set("#optOpmaakLabel",        "step3.opmaak.label");
    set("#optAnonimiseerLabel",   "step3.anoniem.label");
    set("#optAnonimiseerHint",    "step3.anoniem.hint");
    set("#optInclusievBronLabel", "step3.inclusievBron.label");
    set("#optInclusievBronHint",  "step3.inclusievBron.hint");
    const niveauSel = document.getElementById("optNiveau");
    if (niveauSel) {
      const nKeys = ["simpel","middelbaar","professioneel","technisch","expert"];
      [...niveauSel.options].forEach((o, i) => { o.text = t("step3.niveau." + nKeys[i]); });
    }
    const typeSel = document.getElementById("optType");
    if (typeSel) {
      const tKeys = ["verslag","blog","verhaal","memo","email","presentatie"];
      [...typeSel.options].forEach((o, i) => { o.text = t("step3.type." + tKeys[i]); });
    }
    const lengteSel = document.getElementById("optLengte");
    if (lengteSel) {
      const lKeys = ["kort","standaard","uitgebreid"];
      [...lengteSel.options].forEach((o, i) => { o.text = t("step3.lengte." + lKeys[i]); });
    }
    const registerSel = document.getElementById("optRegister");
    if (registerSel) {
      const rKeys = ["informeel","neutraal","formeel"];
      [...registerSel.options].forEach((o, i) => { o.text = t("step3.register." + rKeys[i]); });
    }
    const doelgroepSel = document.getElementById("optDoelgroep");
    if (doelgroepSel) {
      const dKeys = ["team","management","extern","klant"];
      [...doelgroepSel.options].forEach((o, i) => { o.text = t("step3.doelgroep." + dKeys[i]); });
    }
    const opmaakSel = document.getElementById("optOpmaak");
    if (opmaakSel) {
      const oKeys = ["auto","bullets","paragrafen"];
      [...opmaakSel.options].forEach((o, i) => { o.text = t("step3.opmaak." + oKeys[i]); });
    }

    // Step 4 – generate prompt
    set("#step4-h2",           "step4.title");
    set("#step4-desc",         "step4.desc");
    set("#generateBtn",        "step4.generateBtn");
    set("#step4-promptTitle",  "step4.promptTitle");
    set("#copyPrompt",         "step4.copyPrompt");
    set("#generateWithAI",     "step4.generateWithAI");
    set("#step4-hint",         "step4.hint");
    set("#sidebarTitle",       "step4.sidebarTitle");
    set("#sidebarOutputTitle", "step4.sidebarOutputTitle");

    // Step 5 – result
    set("#step5-h2",             "step5.title");
    set("#step5-desc",           "step5.desc");
    set("label[for='aiResult']", "step5.label.result");
    setAttr("#aiResult", "placeholder", "step5.placeholder.result");
    const editBtn = document.getElementById("editResult");
    if (editBtn && aiResultEl && aiResultEl.disabled) {
      editBtn.textContent = t("step5.editBtn");
    }
    set("#viewPreview", "step5.viewPreview");
    set("#viewRaw", "step5.viewRaw");
    setAttr(".result-actions .toggle-group", "aria-label", "step5.ariaView");
    set("#copyResult", "step5.copyResult");
    set("#introVideoCloseBottom", "cookie.close");
    const emptyState = document.querySelector("#resultPreview .empty-state");
    if (emptyState) emptyState.textContent = t("step5.emptyState");

    // Footer
    const footerVersion = document.getElementById("footerVersion");
    if (footerVersion) footerVersion.textContent = `${t("footer.version")} ${currentAppVersion}`;
    set("#footerTagline", "footer.tagline");
    set("#footerDisclaimer", "footer.disclaimer");
    set("#footerCookies", "footer.cookies");
    set("#footerTeam", "footer.team");
    set("#footerPricing", "footer.pricing");

    // Cookie + info modal
    set("#cookieNoticeKicker", "cookie.kicker");
    set("#cookieNoticeTitle", "cookie.title");
    set("#cookieNoticeText", "cookie.text");
    set("#cookieNoticeMore", "cookie.more");
    set("#cookieNoticeClose", "cookie.close");
    setAttr("#infoModalClose", "aria-label", "modal.close");

    // Install explanation modal
    set("#installExplainTitle", "install.modal.title");
    set("#installExplainDesc", "install.modal.desc");
    set("#installExplainCancel", "install.modal.cancel");
    set("#installExplainConfirm", "install.modal.confirm");

    if (!document.getElementById("infoModal").hidden) {
      const modalType = document.getElementById("infoModal").dataset.modalType;
      if (modalType) openInfoModal(modalType);
    }

    // Loader modal
    set("#loaderTitle", "loader.title");

    // PIN modal
    set("#pinTitle", "pin.title");
    set("#pinModal .modal-desc", "pin.desc");
    set("#pinCancel", "pin.cancel");
    set("#pinSubmit", "pin.submit");
    document.querySelectorAll("#pinInputs input").forEach((inp, i) => {
      inp.setAttribute("aria-label", t("pin.digit", i + 1));
    });

    // Re-render section list with new language + re-run counters
    renderSections();
    renderContextOptions();
    renderStep2Mode();
    renderExtraDocsList();
    renderTagManager();
    renderScannerTable();
    updateCharCount();
    updatePreview();
    updateSidebar();
    updateHeroStartButtonLabel();
  }

  /* ---------- DOM refs ---------- */
  const $ = (sel) => document.querySelector(sel);
  const grid = $("#sectionsGrid");
  const transcriptEl = $("#transcript");
  const languageEl = $("#language");
  const charCount = $("#charCount");
  const aiResultEl = $("#aiResult");
  const resultPreview = $("#resultPreview");
  const promptOutput = $("#promptOutput");
  const promptResult = $("#promptResult");
  let sessionWasStarted = false;

  function hasSessionContent() {
    return !!(
      transcriptEl.value.trim() ||
      extraDocs.length ||
      scannerItems.length ||
      promptOutput.textContent.trim() ||
      aiResultEl.value.trim()
    );
  }

  function updateHeroStartButtonLabel() {
    const startBtn = document.getElementById("heroStartBtn");
    if (!startBtn) return;
    if (hasSessionContent()) sessionWasStarted = true;
    startBtn.textContent = sessionWasStarted ? t("hero.cta.newSession") : t("hero.cta.start");
  }

  async function resetSessionWorkflow() {
    transcriptEl.value = "";
    const status = $("#fileStatus");
    if (status) {
      status.hidden = true;
      status.textContent = "";
      status.classList.remove("error");
    }
    extraDocs = [];
    scannerItems = [];
    prefs.analysis = { ...ANALYSIS_DEFAULTS };
    prefs.selectedTags = [];
    CONTEXT_OPTION_DEFS.forEach((o) => {
      prefs.contextOptions[o.id] = false;
    });
    savePrefs(prefs);

    if (promptOutput) promptOutput.textContent = "";
    if (promptResult) promptResult.hidden = true;

    rawView = false;
    aiResultEl.value = "";
    aiResultEl.disabled = true;
    const editBtn = $("#editResult");
    if (editBtn) {
      editBtn.hidden = true;
      editBtn.textContent = t("step5.editBtn");
    }

    renderSections();
    renderContextOptions();
    renderExtraDocsList();
    renderScannerTable();
    renderTagManager();
    updateCharCount();
    updatePreview();
    updateStepStates();
    updateSidebar();
    updateHeroStartButtonLabel();

    // Re-load stored scanner folder handle and verify permission state for the new session.
    scannerDirectoryHandle = null;
    const scanBtn = document.getElementById("scanLocalFolderBtn");
    if (scanBtn) scanBtn.disabled = true;
    setScannerStatus("Lokale map wordt opnieuw gecontroleerd...", false);
    await loadPersistedLocalFolder();
  }

  /* ---------- Preferences (localStorage) ---------- */
  function loadPrefs() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
    } catch {
      return {};
    }
  }
  function savePrefs(prefs) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
    } catch { /* storage unavailable */ }
  }

  const SECTION_MAP = Object.fromEntries(SECTION_DEFS.map((s) => [s.id, s])); // id→def only; use getSectionMap() for translated data

  let prefs = loadPrefs();
  // Initialise defaults on first visit.
  if (!prefs.sections) {
    prefs.sections = {};
    SECTION_DEFS.forEach((s) => (prefs.sections[s.id] = s.def));
  }
  REQUIRED_SECTION_IDS.forEach((id) => {
    prefs.sections[id] = true;
  });
  if (!prefs.sectionOrder) {
    prefs.sectionOrder = SECTION_DEFS.map((s) => s.id);
  }
  if (!prefs.language) prefs.language = "Nederlands";
  if (!prefs.outputOptions) {
    prefs.outputOptions = { ...OUTPUT_DEFAULTS };
  } else {
    // fill any missing keys from defaults
    prefs.outputOptions = { ...OUTPUT_DEFAULTS, ...prefs.outputOptions };
  }
  if (!prefs.contextOptions) {
    prefs.contextOptions = {};
    CONTEXT_OPTION_DEFS.forEach((o) => (prefs.contextOptions[o.id] = false));
  }
  if (!Array.isArray(prefs.tags) || prefs.tags.length === 0) {
    prefs.tags = [...DEFAULT_TAGS];
  }
  if (!Array.isArray(prefs.selectedTags)) {
    prefs.selectedTags = [];
  }
  prefs.selectedTags = prefs.selectedTags.filter((tag) => prefs.tags.includes(tag));
  if (!Array.isArray(prefs.usedTags)) {
    prefs.usedTags = [];
  }
  if (prefs.usedTags.length > 40) {
    prefs.usedTags = prefs.usedTags.slice(0, 40);
  }
  if (typeof prefs.localScannerHandleSupported !== "boolean") {
    prefs.localScannerHandleSupported = false;
  }
  if (!prefs.analysis) {
    prefs.analysis = { ...ANALYSIS_DEFAULTS };
  } else {
    prefs.analysis = { ...ANALYSIS_DEFAULTS, ...prefs.analysis };
  }

  savePrefs(prefs);

  /* ---------- Extra context documents (in-memory only, like the transcript) ---------- */
  let extraDocs = []; // [{ name, size, text }]
  let scannerDirectoryHandle = null;
  let scannerItems = []; // [{ name, text, metadata, selected }]

  /* ---------- Render section checkboxes (with drag-to-reorder) ---------- */
  let dragSrcEl = null;

  function isRequiredSection(id) {
    return REQUIRED_SECTION_IDS.includes(id);
  }

  function isSectionSelected(id) {
    return isRequiredSection(id) || !!prefs.sections[id];
  }

  function isAnalysisMode() {
    return (prefs.analysis && prefs.analysis.mode) === "analysis";
  }

  function hasSectionsSelection() {
    return SECTION_DEFS.some((s) => isSectionSelected(s.id));
  }

  function hasPromptConfiguration() {
    if (isAnalysisMode()) {
      return !!(prefs.analysis && prefs.analysis.option);
    }
    return hasSectionsSelection();
  }

  function updateStep2ModeCopy(analysisMode) {
    const titleEl = document.getElementById("step2Title");
    const descEl = document.getElementById("step2Desc");
    if (!titleEl || !descEl) return;

    if (analysisMode) {
      titleEl.textContent = t("step2.analysis.title");
      descEl.textContent = t("step2.analysis.desc");
    } else {
      titleEl.textContent = t("step2.title");
      descEl.textContent = t("step2.desc");
    }
  }

  function setAnalysisTab(tab) {
    const nextTab = tab === "other" ? "other" : "reports";
    prefs.analysis.tab = nextTab;
    savePrefs(prefs);
  }

  function renderAnalysisTab() {
    const activeTab = prefs.analysis.tab === "other" ? "other" : "reports";
    const tabReports = document.getElementById("analysisTabReports");
    const tabOther = document.getElementById("analysisTabOther");
    const panelReports = document.getElementById("analysisPanelReports");
    const panelOther = document.getElementById("analysisPanelOther");

    if (tabReports) {
      tabReports.classList.toggle("is-active", activeTab === "reports");
      tabReports.setAttribute("aria-selected", activeTab === "reports" ? "true" : "false");
    }
    if (tabOther) {
      tabOther.classList.toggle("is-active", activeTab === "other");
      tabOther.setAttribute("aria-selected", activeTab === "other" ? "true" : "false");
    }
    if (panelReports) panelReports.hidden = activeTab !== "reports";
    if (panelOther) panelOther.hidden = activeTab !== "other";
  }

  function updateStep3Visibility() {
    const step3 = document.getElementById("step-3");
    if (!step3) return;
    step3.hidden = isAnalysisMode();
  }

  function renderAnalysisOptions() {
    const reportsGrid = document.getElementById("analysisReportsGrid");
    const otherGrid = document.getElementById("analysisOtherGrid");
    if (!reportsGrid || !otherGrid) return;

    reportsGrid.innerHTML = "";
    otherGrid.innerHTML = "";

    const options = getAnalysisOptions();
    if (!options.some((opt) => opt.id === prefs.analysis.option)) {
      prefs.analysis.option = ANALYSIS_DEFAULTS.option;
      savePrefs(prefs);
    }

    options.forEach((opt) => {
      const card = document.createElement("label");
      const selected = prefs.analysis.option === opt.id;
      card.className = "analysis-card" + (selected ? " is-selected" : "");
      card.innerHTML = `
        <input type="radio" name="analysisOption" value="${opt.id}" ${selected ? "checked" : ""} hidden />
        <span class="analysis-title">${opt.title}</span>
        <span class="analysis-sub">${opt.desc}</span>
        <span class="analysis-focus">Promptfocus: ${opt.prompt}</span>`;

      const input = card.querySelector("input[name='analysisOption']");
      input.addEventListener("change", () => {
        prefs.analysis.option = opt.id;
        prefs.analysis.tab = opt.group === "other" ? "other" : "reports";
        savePrefs(prefs);
        renderAnalysisOptions();
        updateStepStates();
        updateSidebar();
      });

      if (opt.group === "reports") {
        reportsGrid.appendChild(card);
      } else {
        otherGrid.appendChild(card);
      }
    });

    renderAnalysisTab();
  }

  function renderStep2Mode() {
    const analysisMode = isAnalysisMode();
    const modeSectionsBtn = document.getElementById("modeSectionsBtn");
    const modeAnalysisBtn = document.getElementById("modeAnalysisBtn");
    const sectionsToolbar = document.getElementById("sectionsToolbar");
    const sectionsGrid = document.getElementById("sectionsGrid");
    const analysisBlock = document.getElementById("analysisBlock");
    const ctxBlock = document.getElementById("contextOptionsBlock");

    if (modeSectionsBtn) {
      modeSectionsBtn.classList.toggle("is-active", !analysisMode);
      modeSectionsBtn.setAttribute("aria-selected", analysisMode ? "false" : "true");
    }
    if (modeAnalysisBtn) {
      modeAnalysisBtn.classList.toggle("is-active", analysisMode);
      modeAnalysisBtn.setAttribute("aria-selected", analysisMode ? "true" : "false");
    }
    if (analysisBlock) analysisBlock.hidden = !analysisMode;
    if (sectionsToolbar) sectionsToolbar.hidden = analysisMode;
    if (sectionsGrid) sectionsGrid.hidden = analysisMode;
    if (ctxBlock) ctxBlock.hidden = analysisMode || extraDocs.length === 0;
    updateStep2ModeCopy(analysisMode);
    updateStep3Visibility();

    renderAnalysisOptions();
  }

  function renderSections() {
    grid.innerHTML = "";

    // Keep prefs.sectionOrder in sync with SECTION_DEFS (add new, remove deleted).
    const knownIds = new Set(prefs.sectionOrder);
    SECTION_DEFS.forEach((s) => { if (!knownIds.has(s.id)) prefs.sectionOrder.push(s.id); });
    prefs.sectionOrder = prefs.sectionOrder.filter((id) => SECTION_DEFS.some((s) => s.id === id));

    const sectionMap = getSectionMap();
    prefs.sectionOrder.forEach((id) => {
      const s = sectionMap[id];
      if (!s) return;
      const required = isRequiredSection(s.id);
      const checked = isSectionSelected(s.id);
      const label = document.createElement("label");
      label.className = "section-item" + (checked ? " checked" : "") + (required ? " section-required" : "");
      label.draggable = true;
      label.dataset.id = s.id;
      label.innerHTML = `
        <span class="drag-handle" title="${t("step2.dragHandle.title")}" aria-hidden="true">⠿</span>
        <input type="checkbox" data-id="${s.id}" ${checked ? "checked" : ""} ${required ? "disabled" : ""} hidden />
        <span class="check" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg>
        </span>
        <span class="meta">
          <span class="title">${s.title}${required ? `<span class="tag-required">${t("common.required")}</span>` : (s.tag ? `<span class="tag">${s.tag}</span>` : "")}</span>
          <span class="sub">${s.desc}</span>
        </span>`;

      const input = label.querySelector("input");
      input.addEventListener("change", () => {
        if (required) {
          input.checked = true;
          return;
        }
        prefs.sections[s.id] = input.checked;
        label.classList.toggle("checked", input.checked);
        savePrefs(prefs);
        updateStepStates();
        updateSidebar();
      });

      label.addEventListener("dragstart", (e) => {
        dragSrcEl = e.currentTarget;
        e.dataTransfer.effectAllowed = "move";
        e.dataTransfer.setData("text/plain", dragSrcEl.dataset.id);
        setTimeout(() => dragSrcEl && dragSrcEl.classList.add("dragging"), 0);
      });
      label.addEventListener("dragend", () => {
        if (dragSrcEl) dragSrcEl.classList.remove("dragging");
        grid.querySelectorAll(".section-item").forEach((el) => el.classList.remove("drag-over"));
        // Persist new order.
        prefs.sectionOrder = [...grid.querySelectorAll(".section-item[data-id]")].map((el) => el.dataset.id);
        savePrefs(prefs);
        dragSrcEl = null;
      });
      label.addEventListener("dragenter", (e) => {
        e.preventDefault();
        if (e.currentTarget !== dragSrcEl) e.currentTarget.classList.add("drag-over");
      });
      label.addEventListener("dragleave", (e) => {
        e.currentTarget.classList.remove("drag-over");
      });
      label.addEventListener("dragover", (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = "move";
        const target = e.currentTarget;
        if (!dragSrcEl || target === dragSrcEl) return;
        target.classList.add("drag-over");
        const rect = target.getBoundingClientRect();
        const mid = rect.top + rect.height / 2;
        if (e.clientY < mid) {
          grid.insertBefore(dragSrcEl, target);
        } else {
          target.after(dragSrcEl);
        }
      });
      label.addEventListener("drop", (e) => {
        e.preventDefault();
        e.stopPropagation();
        e.currentTarget.classList.remove("drag-over");
      });

      grid.appendChild(label);
    });
  }

  function setAll(value) {
    SECTION_DEFS.forEach((s) => {
      prefs.sections[s.id] = isRequiredSection(s.id) ? true : value;
    });
    savePrefs(prefs);
    renderSections();
    updateStepStates();
    updateSidebar();
  }
  function setDefault() {
    SECTION_DEFS.forEach((s) => {
      prefs.sections[s.id] = isRequiredSection(s.id) ? true : s.def;
    });
    savePrefs(prefs);
    renderSections();
    updateStepStates();
    updateSidebar();
  }
  function resetOrder() {
    prefs.sectionOrder = SECTION_DEFS.map((s) => s.id);
    savePrefs(prefs);
    renderSections();
    toast(t("toast.orderReset"));
  }

  /* ---------- Render context options (extra documents) ---------- */
  function renderContextOptions() {
    const ctxGrid = document.getElementById("contextOptionsGrid");
    if (!ctxGrid) return;
    ctxGrid.innerHTML = "";
    const options = getContextOptions();
    options.forEach((o) => {
      const checked = !!(prefs.contextOptions && prefs.contextOptions[o.id]);
      const label = document.createElement("label");
      label.className = "section-item" + (checked ? " checked" : "");
      label.dataset.id = o.id;
      label.innerHTML = `
        <input type="checkbox" data-id="${o.id}" ${checked ? "checked" : ""} hidden />
        <span class="check" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg>
        </span>
        <span class="meta">
          <span class="title">${o.title || o.id}</span>
          <span class="sub">${o.desc || ""}</span>
        </span>`;
      const input = label.querySelector("input");
      input.addEventListener("change", () => {
        prefs.contextOptions[o.id] = input.checked;
        label.classList.toggle("checked", input.checked);
        savePrefs(prefs);
        updateSidebar();
      });
      ctxGrid.appendChild(label);
    });
  }

  /* ---------- Show/hide the context options block based on uploaded docs ---------- */
  function updateContextOptionsVisibility() {
    const block = document.getElementById("contextOptionsBlock");
    if (!block) return;
    const hasLinkedDocs = extraDocs.length > 0;
    block.hidden = !hasLinkedDocs || isAnalysisMode();
    block.classList.toggle("context-options-linked", hasLinkedDocs);
    const desc = document.getElementById("contextOptionsDesc");
    if (desc && hasLinkedDocs) {
      const names = extraDocs.slice(0, 3).map((d) => d.name).join(", ");
      const suffix = extraDocs.length > 3 ? ` +${extraDocs.length - 3} meer` : "";
      desc.textContent = `Deze opties gaan over gekoppelde bestanden (${extraDocs.length}): ${names}${suffix}. Vink aan wat je met deze context wilt doen.`;
    }
    renderStep2Mode();
  }

  /* ---------- Render the list of uploaded extra documents ---------- */
  function updateExtraDocsCount() {
    const badge = document.getElementById("extraDocsCount");
    if (!badge) return;
    if (extraDocs.length > 0) {
      badge.hidden = false;
      badge.textContent = `${extraDocs.length}/${MAX_EXTRA_DOCS}`;
    } else {
      badge.hidden = true;
    }
  }

  function formatBytes(bytes) {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(0) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  }

  function renderExtraDocsList() {
    const list = document.getElementById("extraDocsList");
    if (!list) return;
    list.innerHTML = "";
    extraDocs.forEach((doc, idx) => {
      const li = document.createElement("li");
      li.className = "extra-doc-item";
      li.innerHTML = `
        <span class="extra-doc-icon" aria-hidden="true">📄</span>
        <span class="extra-doc-info">
          <span class="extra-doc-name"></span>
          <span class="extra-doc-meta"></span>
        </span>
        <button type="button" class="extra-doc-remove" aria-label="${t("extra.remove")}" title="${t("extra.remove")}">✕</button>`;
      li.querySelector(".extra-doc-name").textContent = doc.name;
      li.querySelector(".extra-doc-meta").textContent =
        `${formatBytes(doc.size)} · ${t("extra.chars", doc.text.length)}`;
      li.querySelector(".extra-doc-remove").addEventListener("click", () => removeExtraDoc(idx));
      list.appendChild(li);
    });
    updateExtraDocsCount();
    updateContextOptionsVisibility();
    updateSidebar();
    updateHeroStartButtonLabel();
  }

  function removeExtraDoc(idx) {
    extraDocs.splice(idx, 1);
    renderExtraDocsList();
    toast(t("extra.removed"));
  }

  async function handleExtraFiles(fileList) {
    const files = Array.from(fileList || []);
    if (files.length === 0) return;

    for (const file of files) {
      if (extraDocs.length >= MAX_EXTRA_DOCS) {
        toast(t("extra.maxReached", MAX_EXTRA_DOCS));
        break;
      }
      const maxBytes = 15 * 1024 * 1024; // 15 MB
      if (file.size > maxBytes) {
        toast("❌ " + file.name + " — " + t("file.tooBig"));
        continue;
      }
      try {
        const text = await extractTextFromFile(file);
        if (!text) throw new Error(t("file.noText"));
        extraDocs.push({ name: file.name, size: file.size, text });
        renderExtraDocsList();
        toast(t("extra.added", file.name));
      } catch (err) {
        toast("❌ " + file.name + " — " + err.message);
      }
    }
  }

  /* ---------- Tag Manager ---------- */
  function normaliseTag(tag) {
    return (tag || "").replace(/\s+/g, " ").trim();
  }

  function markTagsAsUsed(tags) {
    if (!Array.isArray(tags) || tags.length === 0) return;
    const clean = tags
      .map(normaliseTag)
      .filter(Boolean);
    if (clean.length === 0) return;

    prefs.usedTags = [
      ...clean,
      ...prefs.usedTags.filter((t) => !clean.includes(t))
    ].slice(0, 40);
    savePrefs(prefs);
    renderRecentTags();
  }

  function renderRecentTags() {
    const list = document.getElementById("recentTagsList");
    if (!list) return;
    list.innerHTML = "";
    if (!prefs.usedTags.length) {
      const empty = document.createElement("span");
      empty.className = "scanner-meta-muted";
      empty.textContent = "Nog geen gebruikte tags.";
      list.appendChild(empty);
      return;
    }

    prefs.usedTags.slice(0, 12).forEach((tag) => {
      const isSelected = prefs.selectedTags.includes(tag);
      const chip = document.createElement("span");
      chip.className = "tag-chip" + (isSelected ? " is-selected" : "");
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "tag-chip-toggle";
      btn.textContent = isSelected ? `✓ ${tag}` : tag;
      btn.addEventListener("click", () => {
        if (!prefs.tags.includes(tag)) prefs.tags.push(tag);
        if (prefs.selectedTags.includes(tag)) {
          prefs.selectedTags = prefs.selectedTags.filter((t) => t !== tag);
        } else {
          prefs.selectedTags.push(tag);
        }
        savePrefs(prefs);
        renderTagManager();
      });
      chip.appendChild(btn);
      list.appendChild(chip);
    });
  }

  function renderTagManager() {
    const list = document.getElementById("activeTagsList");
    if (!list) return;
    list.innerHTML = "";

    prefs.tags.forEach((tag) => {
      const selected = prefs.selectedTags.includes(tag);
      const chip = document.createElement("span");
      chip.className = "tag-chip" + (selected ? " is-selected" : "");

      const toggleBtn = document.createElement("button");
      toggleBtn.type = "button";
      toggleBtn.className = "tag-chip-toggle";
      toggleBtn.textContent = selected ? `✓ ${tag}` : tag;
      toggleBtn.addEventListener("click", () => {
        if (prefs.selectedTags.includes(tag)) {
          prefs.selectedTags = prefs.selectedTags.filter((t) => t !== tag);
        } else {
          prefs.selectedTags.push(tag);
        }
        savePrefs(prefs);
        renderTagManager();
      });

      chip.appendChild(toggleBtn);

      const removeBtn = document.createElement("button");
      removeBtn.type = "button";
      removeBtn.setAttribute("aria-label", `Verwijder tag ${tag}`);
      removeBtn.title = "Verwijderen";
      removeBtn.textContent = "✕";
      removeBtn.addEventListener("click", () => {
        prefs.tags = prefs.tags.filter((t) => t !== tag);
        prefs.selectedTags = prefs.selectedTags.filter((t) => t !== tag);
        savePrefs(prefs);
        renderTagManager();
      });
      chip.appendChild(removeBtn);

      list.appendChild(chip);
    });

    renderRecentTags();
  }

  function addTagFromInput() {
    const input = document.getElementById("newTagInput");
    if (!input) return;
    const tag = normaliseTag(input.value);
    if (!tag) return;
    if (tag.length < 2) {
      toast("Tag is te kort.");
      return;
    }
    if (prefs.tags.includes(tag)) {
      toast("Tag bestaat al.");
      input.value = "";
      return;
    }
    prefs.tags.push(tag);
    prefs.selectedTags.push(tag);
    savePrefs(prefs);
    input.value = "";
    renderTagManager();
    toast("Tag toegevoegd.");
  }

  function getTagScopeForPrompt() {
    const selected = (prefs.selectedTags || []).filter((tag) => prefs.tags.includes(tag));
    return selected.length ? selected : prefs.tags;
  }

  function truncateForScan(text, maxLen) {
    const val = normaliseTag(text);
    if (!val) return "Onbekend";
    return val.length > maxLen ? val.slice(0, maxLen) + "..." : val;
  }

  function extractTagsFromMetadataText(text) {
    const blockMatch = (text || "").match(/\[METADATA START\]([\s\S]*?)\[METADATA EINDE\]/i);
    if (!blockMatch) return [];
    const tagsLine = blockMatch[1].match(/^Tags:\s*(.*)$/im);
    if (!tagsLine || !tagsLine[1]) return [];
    return tagsLine[1]
      .split(",")
      .map((s) => normaliseTag(s))
      .filter(Boolean);
  }

  function buildMetadataInstructionBlock() {
    const allowedTags = getTagScopeForPrompt();
    const tagList = allowedTags.join(", ");
    return `# COMPLIANCE: VERPLICHT METADATA-BLOK EN TAG-TOEWIJZING
Je output MOET altijd starten met exact dit blok en exacte veldnamen:
[METADATA START]
Datum: [Gevonden datum of "Onbekend"]
Deelnemers: [Namen gescheiden door komma's of "Onbekend"]
Tags: [tags uit de lijst gescheiden door komma's]
Executive Summary: [De executive samenvatting van 3-5 zinnen]
[METADATA EINDE]

Belangrijke regels:
- Gebruik bij Tags uitsluitend tags uit deze lijst: ${tagList || "Onbekend"}
- Gebruik minimaal 1 en maximaal 5 tags in de regel 'Tags:'
- Start je antwoord direct met [METADATA START] en plaats geen tekst erboven
- Vul ontbrekende informatie met 'Onbekend'
- Na [METADATA EINDE] ga je verder met de overige secties in de gevraagde volgorde.`;
  }

  /* ---------- Local folder scanner ---------- */
  const SCANNER_HANDLE_DB = "meetsum-local-scanner-db";
  const SCANNER_HANDLE_STORE = "handles";
  const SCANNER_HANDLE_KEY = "default-directory";

  function supportsDirectoryPicker() {
    return typeof window.showDirectoryPicker === "function";
  }

  function openScannerHandleDb() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(SCANNER_HANDLE_DB, 1);
      request.onupgradeneeded = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains(SCANNER_HANDLE_STORE)) {
          db.createObjectStore(SCANNER_HANDLE_STORE);
        }
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async function saveDirectoryHandleToDb(handle) {
    if (!handle || !supportsDirectoryPicker()) return;
    try {
      const db = await openScannerHandleDb();
      await new Promise((resolve, reject) => {
        const tx = db.transaction(SCANNER_HANDLE_STORE, "readwrite");
        tx.objectStore(SCANNER_HANDLE_STORE).put(handle, SCANNER_HANDLE_KEY);
        tx.oncomplete = resolve;
        tx.onerror = () => reject(tx.error);
      });
      db.close();
      prefs.localScannerHandleSupported = true;
      savePrefs(prefs);
    } catch {
      // Ignore browsers that do not persist handles.
    }
  }

  async function loadDirectoryHandleFromDb() {
    if (!supportsDirectoryPicker()) return null;
    try {
      const db = await openScannerHandleDb();
      const handle = await new Promise((resolve, reject) => {
        const tx = db.transaction(SCANNER_HANDLE_STORE, "readonly");
        const req = tx.objectStore(SCANNER_HANDLE_STORE).get(SCANNER_HANDLE_KEY);
        req.onsuccess = () => resolve(req.result || null);
        req.onerror = () => reject(req.error);
      });
      db.close();
      return handle;
    } catch {
      return null;
    }
  }

  function setScannerStatus(text, isError) {
    const status = document.getElementById("scannerFolderStatus");
    if (!status) return;
    status.textContent = text;
    status.style.color = isError ? "#ef4444" : "";
  }

  async function ensureScannerPermission(handle, write) {
    if (!handle || typeof handle.queryPermission !== "function") return true;
    const mode = write ? "readwrite" : "read";
    if ((await handle.queryPermission({ mode })) === "granted") return true;
    return (await handle.requestPermission({ mode })) === "granted";
  }

  async function selectLocalFolder() {
    if (!supportsDirectoryPicker()) {
      setScannerStatus("Deze browser ondersteunt geen lokale mapscanner (showDirectoryPicker).", true);
      return;
    }
    try {
      const handle = await window.showDirectoryPicker({ mode: "read" });
      const permitted = await ensureScannerPermission(handle, false);
      if (!permitted) {
        setScannerStatus("Toegang tot de map is geweigerd.", true);
        return;
      }
      scannerDirectoryHandle = handle;
      await saveDirectoryHandleToDb(handle);
      setScannerStatus(`Geselecteerde map: ${handle.name}`, false);
      const scanBtn = document.getElementById("scanLocalFolderBtn");
      if (scanBtn) scanBtn.disabled = false;
    } catch (err) {
      if (err && err.name === "AbortError") return;
      setScannerStatus("Mapselectie mislukt.", true);
    }
  }

  async function loadPersistedLocalFolder() {
    if (!supportsDirectoryPicker()) return;
    const handle = await loadDirectoryHandleFromDb();
    if (!handle) {
      setScannerStatus("Nog geen lokale map geselecteerd.", false);
      return;
    }
    const permitted = await ensureScannerPermission(handle, false);
    if (!permitted) {
      setScannerStatus(`Eerder gekozen map gevonden (${handle.name}), maar toestemming moet opnieuw worden gegeven.`, false);
      return;
    }
    scannerDirectoryHandle = handle;
    setScannerStatus(`Geselecteerde map: ${handle.name}`, false);
    const scanBtn = document.getElementById("scanLocalFolderBtn");
    if (scanBtn) scanBtn.disabled = false;
  }

  function isSupportedScannerFile(name) {
    return /\.(txt|docx|pdf)$/i.test(name || "");
  }

  async function collectScannerFiles(directoryHandle, out) {
    for await (const [, entry] of directoryHandle.entries()) {
      if (entry.kind === "file" && isSupportedScannerFile(entry.name)) {
        out.push(entry);
      }
      if (entry.kind === "directory") {
        await collectScannerFiles(entry, out);
      }
    }
  }

  function parseMetadataFromText(text) {
    const source = (text || "").replace(/\r\n/g, "\n");
    const meta = {
      date: "Onbekend",
      participants: "Onbekend",
      tags: [],
      executiveSummary: "Onbekend"
    };

    const blockMatch = source.match(/\[?METADATA\s*START\]?([\s\S]*?)(\[?METADATA\s*(EINDE|END)\]?)/i);
    const blockText = blockMatch ? blockMatch[1] : source;

    const labels = {
      date: "(?:Datum|Date)",
      participants: "(?:Deelnemers|Aanwezigen|Participants|Attendees)",
      tags: "(?:Tags)",
      executive: "(?:Executive Summary|Samenvatting|Executive)"
    };

    const extractField = (labelPattern, fallbackText) => {
      const all = [labels.date, labels.participants, labels.tags, labels.executive].join("|");
      const re = new RegExp(`(?:^|\\n)\\s*${labelPattern}\\s*[:\\-]\\s*([\\s\\S]*?)(?=\\n\\s*(?:${all})\\s*[:\\-]|$)`, "i");
      const m = (fallbackText || "").match(re);
      return m ? normaliseTag(m[1]) : "";
    };

    const foundDate = extractField(labels.date, blockText);
    if (foundDate) {
      meta.date = foundDate;
    } else {
      const rawDate = source.match(/\b(\d{1,2}[\/-]\d{1,2}[\/-]\d{2,4}|\d{4}[\/-]\d{1,2}[\/-]\d{1,2})\b/);
      if (rawDate && rawDate[1]) meta.date = rawDate[1];
    }

    const foundParticipants = extractField(labels.participants, blockText);
    if (foundParticipants) meta.participants = foundParticipants;

    const foundTags = extractField(labels.tags, blockText);
    if (foundTags) {
      meta.tags = foundTags.split(",").map((s) => normaliseTag(s)).filter(Boolean);
    } else {
      const inferred = (prefs.tags || []).filter((tag) => source.toLowerCase().includes(tag.toLowerCase()));
      if (inferred.length) meta.tags = inferred.slice(0, 8);
    }

    const foundExecutive = extractField(labels.executive, blockText);
    if (foundExecutive) {
      meta.executiveSummary = foundExecutive;
    } else {
      const sentences = source.split(/(?<=[.!?])\s+/).map((s) => s.trim()).filter(Boolean);
      if (sentences.length) meta.executiveSummary = sentences.slice(0, 2).join(" ").slice(0, 320);
    }

    return meta;
  }

  function getTagBadgeHtml(tags) {
    if (!tags || tags.length === 0) return `<span class="scanner-meta-muted">Onbekend</span>`;
    return tags.map((tag) => `<span class="metadata-tag-badge">${escapeHtml(tag)}</span>`).join("");
  }

  function openScannerDetailsModal(index) {
    const modal = document.getElementById("scannerDetailsModal");
    const body = document.getElementById("scannerDetailsBody");
    if (!modal || !body || !scannerItems[index]) return;
    const item = scannerItems[index];
    body.innerHTML = `
      <div class="scanner-details-grid">
        <strong>Bestandsnaam</strong><div class="scanner-details-value">${escapeHtml(item.name)}</div>
        <strong>Datum</strong><div class="scanner-details-value">${escapeHtml(item.metadata.date || "Onbekend")}</div>
        <strong>Deelnemers</strong><div class="scanner-details-value">${escapeHtml(item.metadata.participants || "Onbekend")}</div>
        <strong>Tags</strong><div class="scanner-details-value">${item.metadata.tags && item.metadata.tags.length ? escapeHtml(item.metadata.tags.join(", ")) : "Onbekend"}</div>
        <strong>Executive Summary</strong><div class="scanner-details-value">${escapeHtml(item.metadata.executiveSummary || "Onbekend")}</div>
      </div>`;
    modal.hidden = false;
    setBodyFrozen(true);
  }

  function closeScannerDetailsModal() {
    const modal = document.getElementById("scannerDetailsModal");
    if (!modal) return;
    modal.hidden = true;
    if (canUnfreezeBody()) setBodyFrozen(false);
  }

  function openIntroVideoModal() {
    const modal = document.getElementById("introVideoModal");
    const frame = document.getElementById("introVideoFrame");
    if (!modal || !frame) return;
    frame.src = "https://www.youtube-nocookie.com/embed/4FZTvlB0qx0?rel=0";
    modal.hidden = false;
    setBodyFrozen(true);
  }

  function closeIntroVideoModal() {
    const modal = document.getElementById("introVideoModal");
    const frame = document.getElementById("introVideoFrame");
    if (!modal) return;
    modal.hidden = true;
    if (frame) frame.src = "";
    if (canUnfreezeBody()) setBodyFrozen(false);
  }

  function updateScannerLinkButtonState() {
    const btn = document.getElementById("linkSelectedToCreatorBtn");
    if (!btn) return;
    const selectedCount = scannerItems.filter((item) => item.selected).length;
    btn.disabled = selectedCount === 0;
    btn.textContent = selectedCount > 0
      ? `🔗 Koppel selectie aan Transcript (${selectedCount})`
      : "🔗 Koppel selectie aan Transcript";
  }

  function renderScannerTable() {
    const body = document.getElementById("scannerTableBody");
    const wrap = document.getElementById("scannerTableWrap");
    if (!body || !wrap) return;
    body.innerHTML = "";

    if (scannerItems.length === 0) {
      wrap.hidden = true;
      updateScannerLinkButtonState();
      updateHeroStartButtonLabel();
      return;
    }

    wrap.hidden = false;
    scannerItems.forEach((item, index) => {
      const datePreview = truncateForScan(item.metadata.date, 150);
      const participantsPreview = truncateForScan(item.metadata.participants, 150);
      const summaryPreview = truncateForScan(item.metadata.executiveSummary, 150);
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>
          <label>
            <input type="checkbox" class="scanner-link-checkbox" data-index="${index}" ${item.selected ? "checked" : ""} />
            Koppel aan Transcript
          </label>
        </td>
        <td>
          <strong>${escapeHtml(item.name)}</strong>
          <div class="scanner-meta-muted">${item.text.length.toLocaleString("nl-NL")} tekens</div>
        </td>
        <td>
          <div><strong>Datum:</strong> ${escapeHtml(datePreview)}</div>
          <div><strong>Deelnemers:</strong> ${escapeHtml(participantsPreview)}</div>
          <button type="button" class="scanner-details-link" data-index="${index}">Bekijk alle details</button>
        </td>
        <td>${getTagBadgeHtml(item.metadata.tags)}</td>
        <td>
          <div>${escapeHtml(summaryPreview)}</div>
          <button type="button" class="scanner-details-link" data-index="${index}">Volledige executive summary</button>
        </td>`;
      body.appendChild(row);
    });

    body.querySelectorAll(".scanner-link-checkbox").forEach((el) => {
      el.addEventListener("change", (e) => {
        const idx = Number(e.target.dataset.index);
        if (!Number.isNaN(idx) && scannerItems[idx]) {
          scannerItems[idx].selected = e.target.checked;
        }
        updateScannerLinkButtonState();
      });
    });

    body.querySelectorAll(".scanner-details-link").forEach((el) => {
      el.addEventListener("click", (e) => {
        const idx = Number(e.target.dataset.index);
        if (!Number.isNaN(idx)) openScannerDetailsModal(idx);
      });
    });

    updateScannerLinkButtonState();
    updateHeroStartButtonLabel();
  }

  async function scanLocalFolder() {
    if (!scannerDirectoryHandle) {
      setScannerStatus("Selecteer eerst een map.", true);
      return;
    }
    const permitted = await ensureScannerPermission(scannerDirectoryHandle, false);
    if (!permitted) {
      setScannerStatus("Geen toestemming om map te lezen.", true);
      return;
    }

    setScannerStatus("Map wordt gescand...", false);
    const fileHandles = [];
    await collectScannerFiles(scannerDirectoryHandle, fileHandles);

    if (fileHandles.length === 0) {
      scannerItems = [];
      renderScannerTable();
      setScannerStatus("Geen .txt, .docx of .pdf bestanden gevonden in de map.", false);
      return;
    }

    const nextItems = [];
    for (const fileHandle of fileHandles) {
      try {
        const file = await fileHandle.getFile();
        const text = await extractTextFromFile(file);
        if (!text || !text.trim()) continue;
        const metadata = parseMetadataFromText(text);
        nextItems.push({
          name: file.name,
          text,
          metadata,
          selected: false
        });
      } catch {
        // Skip unreadable files and continue with the rest.
      }
    }

    scannerItems = nextItems;
    renderScannerTable();
    setScannerStatus(`${scannerItems.length} bestanden gescand en geparseerd.`, false);
  }

  function openScannerLinkModal() {
    const modal = document.getElementById("scannerLinkModal");
    const list = document.getElementById("scannerLinkList");
    if (!modal || !list) return;
    const selected = scannerItems.filter((item) => item.selected);
    if (selected.length === 0) {
      toast("Selecteer minimaal 1 bestand om te koppelen.");
      return;
    }

    list.innerHTML = "";
    selected.forEach((item) => {
      const li = document.createElement("li");
      li.textContent = `${item.name} · ${item.metadata.date} · ${item.metadata.participants}`;
      list.appendChild(li);
    });

    modal.hidden = false;
    setBodyFrozen(true);
  }

  function closeScannerLinkModal() {
    const modal = document.getElementById("scannerLinkModal");
    if (!modal) return;
    modal.hidden = true;
    if (canUnfreezeBody()) setBodyFrozen(false);
  }

  function linkSelectedScannerDocsToCreator() {
    const selected = scannerItems.filter((item) => item.selected);
    if (selected.length === 0) {
      toast("Selecteer minimaal 1 bestand om te koppelen.");
      return;
    }

    let added = 0;
    for (const item of selected) {
      if (extraDocs.length >= MAX_EXTRA_DOCS) break;
      const exists = extraDocs.some((doc) => doc.name === item.name && doc.text === item.text);
      if (exists) continue;
      extraDocs.push({ name: item.name, size: item.text.length, text: item.text });
      added += 1;
    }

    selected.forEach((item) => {
      item.selected = false;
      markTagsAsUsed(item.metadata.tags || []);
    });

    renderExtraDocsList();
    if (!anyContextSelected()) {
      prefs.contextOptions.recap = true;
      savePrefs(prefs);
      renderContextOptions();
      updateSidebar();
    }
    renderScannerTable();
    closeScannerLinkModal();

    if (added > 0) {
      toast(`${added} document(en) gekoppeld aan Transcriptcontext.`);
      const extra = document.getElementById("extraDocs");
      if (extra) extra.open = true;
    } else {
      toast("Geen nieuwe documenten toegevoegd (mogelijk al aanwezig of maximum bereikt).");
    }
  }

  function buildAnalysisPrompt(transcript, language, targetLangValue) {
    const base = `# ANALYSE MODUS\nWerk als senior business-analist. Gebruik uitsluitend informatie uit het transcript, verzin niets.\nSchrijf de output volledig in ${language}.`;
    const extraBlock = buildExtraContextBlock();
    const transcriptBlock = `# INPUT TRANSCRIPT\n\`\`\`\n${transcript || "[Plak hier je Teams-transcript]"}\n\`\`\``;
    const selected = getAnalysisPromptCopy(prefs.analysis.option, targetLangValue);
    const styleGuide = getAnalysisStyleGuide(prefs.analysis.option, targetLangValue);

    return [
      base,
      styleGuide,
      `# OPDRACHT: ${selected ? selected.title : "Analyse"}\n${selected ? selected.prompt : "Analyseer het transcript."}`,
      transcriptBlock,
      extraBlock
    ].filter(Boolean).join("\n\n");
  }

  /* ---------- Prompt generation ---------- */
  function buildPrompt() {
    const transcript = transcriptEl.value.trim();
    const langNames = getLang()["summaryLangNames"] || {};
    const language = langNames[languageEl.value] || languageEl.value;

    if (isAnalysisMode()) {
      return buildAnalysisPrompt(transcript, language, languageEl.value);
    }

    // Use the user's custom order, filtered to selected sections only.
    const orderedIds = prefs.sectionOrder || SECTION_DEFS.map((s) => s.id);
    const sectionMap = getSectionMap();
    const selected = orderedIds
      .map((id) => sectionMap[id])
      .filter((s) => s && isSectionSelected(s.id));

    const sectionInstructions = selected
      .map((s, i) => `${i + 1}. ${s.prompt}`)
      .join("\n\n");
    const headingList = selected.map((s) => `- ${s.title}`).join("\n");

    const tpl = getLang()["promptTemplate"];
    const basePrompt = tpl
      ? tpl(language, headingList, sectionInstructions, transcript, prefs.outputOptions || OUTPUT_DEFAULTS)
      : `${headingList}\n\n${sectionInstructions}\n\n${transcript}`;

    const extraBlock = buildExtraContextBlock();
    const metadataBlock = buildMetadataInstructionBlock();
    return [metadataBlock, basePrompt, extraBlock].filter(Boolean).join("\n\n");
  }

  /* ---------- Build the optional extra-context block ----------
     Returns "" when there is nothing to add (no docs, or no context option selected). */
  function buildExtraContextBlock() {
    if (extraDocs.length === 0) return "";
    const ctxMap = getContextOptionMap();
    const selected = CONTEXT_OPTION_DEFS
      .map((o) => ctxMap[o.id])
      .filter((o) => o && prefs.contextOptions[o.id]);
    const optionInstructions = selected
      .map((o, i) => `${i + 1}. ${o.prompt}`)
      .join("\n") || "1. Gebruik de gekoppelde bestanden als achtergrondcontext om voortgang, eerdere besluiten en openstaande acties te herkennen. Verwijs hier expliciet naar als achtergrond en verzin niets.";

    const docsBlock = extraDocs
      .map((doc, i) => {
        const n = i + 1;
        return t("extra.docWrap", n, doc.name, doc.text);
      })
      .join("\n\n");

    const tpl = getLang()["extraContextTemplate"];
    const linkedNotice = "\n\n## GEKOPPELDE BESTANDEN UIT MAP SCANNER\nDeze documenten zijn via 'Koppel aan Transcript' gekoppeld en moeten als extra context worden meegenomen.";
    return tpl ? tpl(optionInstructions, docsBlock) + linkedNotice : "";
  }

  /* ---------- Step state management ---------- */
  function updateStepStates() {
    const hasTranscript = transcriptEl.value.trim().length > 30;
    const anySection = hasPromptConfiguration();
    const hasResult = aiResultEl && aiResultEl.value.trim().length > 0;

    const setLocked = (sel, locked) => {
      const el = document.querySelector(sel);
      if (!el) return;
      el.classList.toggle("step-locked", locked);
    };
    // Steps 2 and 3 unlock when transcript is provided
    setLocked("#step-2", !hasTranscript);
    setLocked("#step-3", !hasTranscript);
    // Step 4 unlocks when transcript + at least 1 section
    setLocked("#step-4", !(hasTranscript && anySection));
    // Step 5 unlocks when a result exists
    setLocked("#step-5", !hasResult);

    // Update progress indicator anchors
    const steps = document.querySelectorAll(".sp-step");
    const unlocked = [true, hasTranscript, hasTranscript, hasTranscript && anySection, hasResult];
    steps.forEach((el, i) => {
      el.classList.toggle("sp-locked", !unlocked[i]);
      el.classList.toggle("sp-active", unlocked[i]);
    });

    // Lines between steps
    const lines = document.querySelectorAll(".sp-line");
    lines.forEach((line, i) => {
      line.classList.toggle("sp-done", unlocked[i + 1]);
    });
  }

  /* ---------- Sidebar: show selected sections in step 4 ---------- */
  function updateSidebar() {
    const list = document.getElementById("sectionsSidebarList");
    const outputList = document.getElementById("outputSidebarList");
    const outputTitle = document.getElementById("sidebarOutputTitle");
    if (!list || !outputList) return;
    if (isAnalysisMode()) {
      const optionMap = getAnalysisOptionMap();
      const selected = optionMap[prefs.analysis.option] || optionMap[ANALYSIS_DEFAULTS.option];
      list.innerHTML = `<li class="sidebar-item"><strong>Analyse modus</strong><span>${selected ? selected.title : "Analyse"}</span></li>`;
      if (outputTitle) outputTitle.hidden = true;
      outputList.hidden = true;
      outputList.innerHTML = "";
    } else {
      const orderedIds = prefs.sectionOrder || SECTION_DEFS.map((s) => s.id);
      const sectionMap = getSectionMap();
      const selected = orderedIds.map((id) => sectionMap[id]).filter((s) => s && isSectionSelected(s.id));
      list.innerHTML = selected.map((s) =>
        `<li class="sidebar-item"><strong>${s.title}</strong><span>${s.desc}</span></li>`
      ).join("") || `<li class="sidebar-empty">${t("toast.noSection")}</li>`;

      if (outputTitle) outputTitle.hidden = false;
      outputList.hidden = false;
      outputList.innerHTML = getOutputOptionSummary().map((item) =>
        `<li class="sidebar-item"><strong>${item.label}</strong><span>${item.value}</span></li>`
      ).join("");
    }

    // Append selected context options (extra documents) when applicable.
    if (extraDocs.length > 0 && anyContextSelected()) {
      const ctxMap = getContextOptionMap();
      const ctxSelected = CONTEXT_OPTION_DEFS
        .map((o) => ctxMap[o.id])
        .filter((o) => o && prefs.contextOptions[o.id]);
      list.innerHTML += `<li class="sidebar-item"><strong>${t("extra.sidebarDocs", extraDocs.length)}</strong><span>${ctxSelected.map((o) => o.title).join(", ")}</span></li>`;
    }

  }

  function openInfoModal(type) {
    const modal = document.getElementById("infoModal");
    const title = document.getElementById("infoModalTitle");
    const body = document.getElementById("infoModalBody");
    if (!modal || !title || !body) return;
    modal.dataset.modalType = type;
    title.textContent = t(`legal.${type}.title`);
    body.innerHTML = t(`legal.${type}.body`);
    modal.hidden = false;
    setBodyFrozen(true);
  }

  function closeInfoModal() {
    const modal = document.getElementById("infoModal");
    if (!modal) return;
    modal.hidden = true;
    delete modal.dataset.modalType;
    if (canUnfreezeBody()) setBodyFrozen(false);
  }

  function dismissCookieNotice() {
    const sheet = document.getElementById("cookieNotice");
    if (!sheet) return;
    sheet.hidden = true;
    try { localStorage.setItem(COOKIE_NOTICE_KEY, "dismissed"); } catch { /* noop */ }
    if (canUnfreezeBody()) setBodyFrozen(false);
  }

  function initFooterAndLegal() {
    document.querySelectorAll("[data-modal]").forEach((btn) => {
      btn.addEventListener("click", () => openInfoModal(btn.dataset.modal));
    });

    const closeBtn = document.getElementById("infoModalClose");
    if (closeBtn) closeBtn.addEventListener("click", closeInfoModal);

    const infoModal = document.getElementById("infoModal");
    if (infoModal) {
      infoModal.addEventListener("click", (e) => {
        if (e.target === infoModal) closeInfoModal();
      });
    }

    const cookieMore = document.getElementById("cookieNoticeMore");
    const cookieClose = document.getElementById("cookieNoticeClose");
    const cookieSheet = document.getElementById("cookieNotice");

    if (cookieMore) cookieMore.addEventListener("click", () => openInfoModal("cookies"));
    if (cookieClose) cookieClose.addEventListener("click", dismissCookieNotice);

    try {
      const dismissed = localStorage.getItem(COOKIE_NOTICE_KEY) === "dismissed";
      if (!dismissed && cookieSheet) {
        cookieSheet.hidden = false;
        setBodyFrozen(true);
      }
    } catch {
      if (cookieSheet) {
        cookieSheet.hidden = false;
        setBodyFrozen(true);
      }
    }
  }

  function generatePrompt() {
    const anySelected = hasPromptConfiguration();
    if (!anySelected) {
      toast(isAnalysisMode() ? "Kies eerst een analyse-optie." : t("toast.noSection"));
      return;
    }
    if (!transcriptEl.value.trim()) {
      toast(t("toast.noTranscript"));
    }

    emitPrompt();
  }

  function emitPrompt() {
    markTagsAsUsed(prefs.selectedTags || []);
    const prompt = buildPrompt();
    promptOutput.textContent = prompt;
    promptResult.hidden = false;

    // Show AI button if we have a transcript
    if (transcriptEl.value.trim()) {
      $("#generateWithAI").hidden = false;
    } else {
      $("#generateWithAI").hidden = true;
    }

    promptResult.scrollIntoView({ behavior: "smooth", block: "nearest" });
    updateHeroStartButtonLabel();
  }

  /* ---------- Generic confirm dialog (Promise<boolean>) ---------- */
  function confirmDialog({ title, desc, yes, no }) {
    return new Promise((resolve) => {
      const modal = $("#confirmModal");
      const titleEl = $("#confirmTitle");
      const descEl = $("#confirmDesc");
      const yesBtn = $("#confirmYes");
      const noBtn = $("#confirmNo");
      if (!modal || !yesBtn || !noBtn) { resolve(true); return; }

      if (titleEl) titleEl.textContent = title || t("confirm.defaultTitle");
      if (descEl) descEl.textContent = desc || "";
      yesBtn.textContent = yes || t("confirm.yes");
      noBtn.textContent = no || t("confirm.no");

      const close = (result) => {
        modal.hidden = true;
        yesBtn.removeEventListener("click", onYes);
        noBtn.removeEventListener("click", onNo);
        modal.removeEventListener("click", onBackdrop);
        document.removeEventListener("keydown", onKey);
        if (canUnfreezeBody()) setBodyFrozen(false);
        resolve(result);
      };
      const onYes = () => close(true);
      const onNo = () => close(false);
      const onBackdrop = (e) => { if (e.target === modal) close(false); };
      const onKey = (e) => { if (e.key === "Escape") close(false); };

      yesBtn.addEventListener("click", onYes);
      noBtn.addEventListener("click", onNo);
      modal.addEventListener("click", onBackdrop);
      document.addEventListener("keydown", onKey);

      modal.hidden = false;
      setBodyFrozen(true);
      yesBtn.focus();
    });
  }

  function requestInstallConfirmation() {
    return new Promise((resolve) => {
      const modal = document.getElementById("installExplainModal");
      const confirmBtn = document.getElementById("installExplainConfirm");
      const cancelBtn = document.getElementById("installExplainCancel");
      if (!modal || !confirmBtn || !cancelBtn) {
        resolve(true);
        return;
      }

      const close = (result) => {
        modal.hidden = true;
        confirmBtn.removeEventListener("click", onConfirm);
        cancelBtn.removeEventListener("click", onCancel);
        modal.removeEventListener("click", onBackdrop);
        document.removeEventListener("keydown", onKey);
        if (canUnfreezeBody()) setBodyFrozen(false);
        resolve(result);
      };

      const onConfirm = () => close(true);
      const onCancel = () => close(false);
      const onBackdrop = (e) => { if (e.target === modal) close(false); };
      const onKey = (e) => { if (e.key === "Escape") close(false); };

      confirmBtn.addEventListener("click", onConfirm);
      cancelBtn.addEventListener("click", onCancel);
      modal.addEventListener("click", onBackdrop);
      document.addEventListener("keydown", onKey);

      modal.hidden = false;
      setBodyFrozen(true);
      confirmBtn.focus();
    });
  }

  async function callGeminiAPI(prompt) {
    const btn = $("#generateWithAI");
    const originalText = btn.textContent;

    // If a PIN is required and we don't have a verified one yet, ask for it first.
    if (pinRequired && !sessionPin) {
      const ok = await requestPin();
      if (!ok) return; // user cancelled
    }

    btn.disabled = true;
    btn.textContent = t("btn.generating");
    showLoader();

    try {
      const response = await fetch("/api/summarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, pin: sessionPin || undefined })
      });

      const data = await response.json();

      if (response.status === 401) {
        // PIN became invalid – clear and re-prompt
        sessionPin = null;
        try { sessionStorage.removeItem("meetsum.pin"); } catch { /* noop */ }
        throw new Error(data.error || "Onjuiste PIN");
      }

      if (!response.ok) {
        throw new Error(data.error || "API Error");
      }

      if (data.success && data.text) {
        completeLoader();
        setResult(data.text);

        // Scroll to result
        document.getElementById("step-5").scrollIntoView({ behavior: "smooth", block: "start" });
        toast("✅ Resultaat ververst!");
      } else {
        throw new Error(data.error || "Onbekende fout");
      }
    } catch (err) {
      toast("❌ Fout: " + err.message);
      console.error(err);
    } finally {
      hideLoader();
      btn.disabled = false;
      btn.textContent = originalText;
    }
  }

  /* ---------- PIN handling ---------- */
  let pinRequired = false;
  let sessionPin = null;

  async function checkPinStatus() {
    try {
      const res = await fetch("/api/pin-status");
      const data = await res.json();
      pinRequired = !!data.pinRequired;
    } catch {
      pinRequired = false;
    }
    // Restore a previously verified PIN for this browser session.
    try {
      const stored = sessionStorage.getItem("meetsum.pin");
      if (stored) sessionPin = stored;
    } catch { /* noop */ }
  }

  // Returns a Promise<boolean> – true when a valid PIN was entered.
  function requestPin() {
    return new Promise((resolve) => {
      const modal = $("#pinModal");
      const inputs = Array.from($("#pinInputs").querySelectorAll("input"));
      const errorEl = $("#pinError");
      const submitBtn = $("#pinSubmit");
      const cancelBtn = $("#pinCancel");

      const reset = () => {
        inputs.forEach((i) => (i.value = ""));
        errorEl.hidden = true;
        inputs[0].focus();
      };

      const close = (result) => {
        modal.hidden = true;
        submitBtn.removeEventListener("click", onSubmit);
        cancelBtn.removeEventListener("click", onCancel);
        inputs.forEach((inp) => {
          inp.removeEventListener("input", onInput);
          inp.removeEventListener("keydown", onKey);
        });
        resolve(result);
      };

      const onInput = (e) => {
        e.target.value = e.target.value.replace(/\D/g, "");
        const idx = inputs.indexOf(e.target);
        if (e.target.value && idx < inputs.length - 1) inputs[idx + 1].focus();
      };
      const onKey = (e) => {
        const idx = inputs.indexOf(e.target);
        if (e.key === "Backspace" && !e.target.value && idx > 0) inputs[idx - 1].focus();
        if (e.key === "Enter") onSubmit();
      };

      const onSubmit = async () => {
        const pin = inputs.map((i) => i.value).join("");
        if (!/^\d{4}$/.test(pin)) {
          errorEl.textContent = "Voer 4 cijfers in.";
          errorEl.hidden = false;
          return;
        }
        submitBtn.disabled = true;
        submitBtn.textContent = "Controleren…";
        try {
          const res = await fetch("/api/verify-pin", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ pin })
          });
          const data = await res.json();
          if (data.success) {
            sessionPin = pin;
            try { sessionStorage.setItem("meetsum.pin", pin); } catch { /* noop */ }
            close(true);
          } else {
            errorEl.textContent = data.error || "Onjuiste PIN";
            errorEl.hidden = false;
            inputs.forEach((i) => (i.value = ""));
            inputs[0].focus();
          }
        } catch {
          errorEl.textContent = "Serverfout. Probeer opnieuw.";
          errorEl.hidden = false;
        } finally {
          submitBtn.disabled = false;
          submitBtn.textContent = "Ontgrendelen";
        }
      };

      const onCancel = () => close(false);

      submitBtn.addEventListener("click", onSubmit);
      cancelBtn.addEventListener("click", onCancel);
      inputs.forEach((inp) => {
        inp.addEventListener("input", onInput);
        inp.addEventListener("keydown", onKey);
      });

      modal.hidden = false;
      reset();
    });
  }

  /* ---------- File upload & parsing ---------- */
  async function extractTextFromFile(file) {
    const name = file.name.toLowerCase();
    const ext = name.slice(name.lastIndexOf("."));

    if (ext === ".txt" || ext === ".md" || ext === ".markdown") {
      return await file.text();
    }

    if (ext === ".pdf") {
      if (!window.pdfjsLib) throw new Error(t("file.pdfNotLoaded"));
      window.pdfjsLib.GlobalWorkerOptions.workerSrc =
        "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
      const buf = await file.arrayBuffer();
      const pdf = await window.pdfjsLib.getDocument({ data: buf }).promise;
      let text = "";
      for (let p = 1; p <= pdf.numPages; p++) {
        const page = await pdf.getPage(p);
        const content = await page.getTextContent();
        text += content.items.map((it) => it.str).join(" ") + "\n";
      }
      return text.trim();
    }

    if (ext === ".docx") {
      if (!window.mammoth) throw new Error(t("file.wordNotLoaded"));
      const buf = await file.arrayBuffer();
      const result = await window.mammoth.extractRawText({ arrayBuffer: buf });
      return result.value.trim();
    }

    if (ext === ".doc") {
      throw new Error(t("file.docOld"));
    }

    throw new Error(t("file.unsupported"));
  }

  async function handleFile(file) {
    if (!file) return;
    const status = $("#fileStatus");
    status.hidden = false;
    status.classList.remove("error");
    status.textContent = "⏳ " + file.name;

    const maxBytes = 15 * 1024 * 1024; // 15 MB
    if (file.size > maxBytes) {
      status.classList.add("error");
      status.textContent = "❌ Bestand te groot (max 15 MB)";
      return;
    }

    try {
      const text = await extractTextFromFile(file);
      if (!text) throw new Error("Geen tekst gevonden in bestand.");
      transcriptEl.value = text;
      updateCharCount();
      updateStepStates();
      status.textContent = "✅ " + file.name;
      toast(t("toast.fileLoaded", file.name));
    } catch (err) {
      status.classList.add("error");
      status.textContent = "❌ " + err.message;
      toast("❌ " + err.message);
    }
  }

  /* ---------- Minimal Markdown renderer ---------- */
  function escapeHtml(str) {
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  function inlineMd(text) {
    let t = escapeHtml(text);
    t = t.replace(/`([^`]+)`/g, "<code>$1</code>");
    t = t.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
    t = t.replace(/(^|[^*])\*([^*]+)\*/g, "$1<em>$2</em>");
    t = t.replace(/\b_([^_]+)_\b/g, "<em>$1</em>");
    t = t.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');
    return t;
  }

  function renderMarkdown(src) {
    const lines = src.replace(/\r\n/g, "\n").split("\n");
    let html = "";
    let i = 0;

    const isTableSep = (s) => /^\s*\|?[\s:|-]+\|?\s*$/.test(s) && s.includes("-");

    while (i < lines.length) {
      let line = lines[i];

      // fenced code block
      if (/^```/.test(line)) {
        let code = "";
        i++;
        while (i < lines.length && !/^```/.test(lines[i])) {
          code += lines[i] + "\n";
          i++;
        }
        i++; // skip closing fence
        html += `<pre><code>${escapeHtml(code.replace(/\n$/, ""))}</code></pre>`;
        continue;
      }

      // table: header row + separator row
      if (line.includes("|") && i + 1 < lines.length && isTableSep(lines[i + 1])) {
        const parseRow = (r) =>
          r.replace(/^\s*\|/, "").replace(/\|\s*$/, "").split("|").map((c) => c.trim());
        const headers = parseRow(line);
        i += 2; // skip header + separator
        let body = "";
        while (i < lines.length && lines[i].includes("|") && lines[i].trim() !== "") {
          const cells = parseRow(lines[i]);
          body += "<tr>" + cells.map((c) => `<td>${inlineMd(c)}</td>`).join("") + "</tr>";
          i++;
        }
        html +=
          "<table><thead><tr>" +
          headers.map((h) => `<th>${inlineMd(h)}</th>`).join("") +
          "</tr></thead><tbody>" + body + "</tbody></table>";
        continue;
      }

      // headings
      const h = line.match(/^(#{1,6})\s+(.*)$/);
      if (h) {
        const level = h[1].length;
        html += `<h${level}>${inlineMd(h[2])}</h${level}>`;
        i++;
        continue;
      }

      // horizontal rule
      if (/^\s*([-*_])\1\1+\s*$/.test(line)) {
        html += "<hr />";
        i++;
        continue;
      }

      // blockquote
      if (/^\s*>\s?/.test(line)) {
        let quote = "";
        while (i < lines.length && /^\s*>\s?/.test(lines[i])) {
          quote += lines[i].replace(/^\s*>\s?/, "") + " ";
          i++;
        }
        html += `<blockquote>${inlineMd(quote.trim())}</blockquote>`;
        continue;
      }

      // unordered list
      if (/^\s*[-*+]\s+/.test(line)) {
        let items = "";
        while (i < lines.length && /^\s*[-*+]\s+/.test(lines[i])) {
          items += `<li>${inlineMd(lines[i].replace(/^\s*[-*+]\s+/, ""))}</li>`;
          i++;
        }
        html += `<ul>${items}</ul>`;
        continue;
      }

      // ordered list
      if (/^\s*\d+\.\s+/.test(line)) {
        let items = "";
        while (i < lines.length && /^\s*\d+\.\s+/.test(lines[i])) {
          items += `<li>${inlineMd(lines[i].replace(/^\s*\d+\.\s+/, ""))}</li>`;
          i++;
        }
        html += `<ol>${items}</ol>`;
        continue;
      }

      // blank line
      if (line.trim() === "") {
        i++;
        continue;
      }

      // paragraph (gather consecutive non-blank, non-special lines)
      let para = "";
      while (
        i < lines.length &&
        lines[i].trim() !== "" &&
        !/^(#{1,6})\s/.test(lines[i]) &&
        !/^\s*[-*+]\s+/.test(lines[i]) &&
        !/^\s*\d+\.\s+/.test(lines[i]) &&
        !/^\s*>\s?/.test(lines[i]) &&
        !/^```/.test(lines[i]) &&
        !(lines[i].includes("|") && i + 1 < lines.length && isTableSep(lines[i + 1]))
      ) {
        para += (para ? " " : "") + lines[i];
        i++;
      }
      if (para) html += `<p>${inlineMd(para)}</p>`;
    }
    return html;
  }

  /* ---------- Result preview ---------- */
  let rawView = false;

  // Fill the result area after AI analysis. Textarea stays locked until the
  // user explicitly chooses to edit it.
  function setResult(text) {
    aiResultEl.value = text;
    markTagsAsUsed(extractTagsFromMetadataText(text));
    aiResultEl.disabled = true;
    const editBtn = $("#editResult");
    if (editBtn) {
      editBtn.textContent = t("step5.editBtn");
      editBtn.hidden = !text.trim();
    }
    updatePreview();
    updateStepStates();
    updateHeroStartButtonLabel();
  }

  function updatePreview() {
    const text = aiResultEl.value;
    const hasText = text.trim().length > 0;
    $("#downloadMd").disabled = !hasText;
    $("#downloadTxt").disabled = !hasText;
    const copyBtn = $("#copyResult");
    if (copyBtn) copyBtn.disabled = !hasText;
    const editBtn = $("#editResult");
    if (editBtn && !hasText) editBtn.hidden = true;

    if (!hasText) {
      resultPreview.classList.remove("raw");
      resultPreview.innerHTML =
        `<p class="empty-state">${t("step5.emptyState")}</p>`;
      return;
    }

    if (rawView) {
      resultPreview.classList.add("raw");
      resultPreview.textContent = text;
    } else {
      resultPreview.classList.remove("raw");
      resultPreview.innerHTML = `<div class="md-body">${renderMarkdown(text)}</div>`;
    }
  }

  /* ---------- Download ---------- */
  function download(ext) {
    const text = aiResultEl.value;
    if (!text.trim()) return;
    const mime = ext === "md" ? "text/markdown" : "text/plain";
    const blob = new Blob([text], { type: `${mime};charset=utf-8` });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    const stamp = new Date().toISOString().slice(0, 10);
    a.href = url;
    a.download = t("download.filename", stamp, ext);
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    toast(t("toast.downloaded", ext));
  }

  /* ---------- Clipboard ---------- */
  async function copyPrompt() {
    const text = promptOutput.textContent;
    try {
      await navigator.clipboard.writeText(text);
      toast(t("toast.promptCopied"));
    } catch {
      // fallback
      const ta = document.createElement("textarea");
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      ta.remove();
      toast(t("toast.promptCopied"));
    }
  }

  /* ---------- Toast ---------- */
  let toastTimer;
  function toast(msg, options) {
    const el = $("#toast");
    if (!el) return;
    el.onclick = null;
    el.classList.remove("toast-action");
    el.textContent = msg;
    if (options && typeof options.onClick === "function") {
      el.classList.add("toast-action");
      el.onclick = () => {
        options.onClick();
        el.classList.remove("show", "toast-action");
      };
    }
    el.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      el.classList.remove("show", "toast-action");
      el.onclick = null;
    }, options && options.duration ? options.duration : 4000);
  }

  /* ---------- AI loader with progress ---------- */
  let loaderTimer = null;

  function getLoaderStages() {
    return [
      [20, t("loader.stage1")],
      [40, t("loader.stage2")],
      [65, t("loader.stage3")],
      [85, t("loader.stage4")],
      [95, t("loader.stage5")]
    ];
  }

  function setProgress(value) {
    const v = Math.min(100, Math.round(value));
    const bar = $("#progressBar");
    const pct = $("#progressPct");
    const track = document.querySelector("#loaderOverlay .progress-track");
    if (bar) bar.style.width = v + "%";
    if (pct) pct.textContent = v + "%";
    if (track) track.setAttribute("aria-valuenow", v);
  }

  function showLoader() {
    const overlay = $("#loaderOverlay");
    const status = $("#loaderStatus");
    if (!overlay) return;
    let p = 0;
    setProgress(0);
    if (status) status.textContent = t("loader.initial");
    overlay.hidden = false;
    clearInterval(loaderTimer);
    loaderTimer = setInterval(() => {
      // Ease towards 95% while we wait for the response.
      p += Math.max(0.5, (95 - p) * 0.05);
      if (p > 95) p = 95;
      setProgress(p);
      const stage = getLoaderStages().find((s) => p < s[0]);
      if (stage && status) status.textContent = stage[1];
    }, 220);
  }

  function completeLoader() {
    clearInterval(loaderTimer);
    setProgress(100);
    const status = $("#loaderStatus");
    if (status) status.textContent = "Klaar! 🎉";
  }

  function hideLoader() {
    clearInterval(loaderTimer);
    setTimeout(() => {
      const overlay = $("#loaderOverlay");
      if (overlay) overlay.hidden = true;
    }, 350);
  }

  /* ---------- Copy result ---------- */
  async function copyResult() {
    const text = aiResultEl.value;
    if (!text.trim()) return;
    try {
      await navigator.clipboard.writeText(text);
      toast(t("toast.resultCopied"));
    } catch {
      const ta = document.createElement("textarea");
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      ta.remove();
      toast(t("toast.resultCopied"));
    }
  }

  /* ---------- Theme ---------- */
  function applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    try { localStorage.setItem(THEME_KEY, theme); } catch { /* noop */ }
  }
  function initTheme() {
    let theme = null;
    try { theme = localStorage.getItem(THEME_KEY); } catch { /* noop */ }
    if (!theme) {
      theme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    }
    applyTheme(theme);
  }

  /* ---------- Char count ---------- */
  function updateCharCount() {
    const n = transcriptEl.value.length;
    charCount.textContent = t("step1.charCount", n);
    updateHeroStartButtonLabel();
  }

  /* ---------- Init ---------- */
  function init() {
    // Resolve UI language before anything else
    try {
      const saved = localStorage.getItem(UI_LANG_KEY);
      if (saved === "en" || saved === "nl") currentLangCode = saved;
    } catch { /* noop */ }

    initTheme();
    applyTranslations(); // sets all text, calls renderSections + updatePreview
    checkPinStatus();

    // Restore language (but NOT transcript — transcript is always fresh on load)
    languageEl.value = prefs.language;
    // A new browser start always begins with an empty result area.
    aiResultEl.value = "";
    aiResultEl.disabled = true;
    updatePreview();
    updateCharCount();
    updateStepStates();
    updateSidebar();

    // Restore output options selects
    const oo = prefs.outputOptions || OUTPUT_DEFAULTS;
    const setOpt = (id, val) => { const el = $("#" + id); if (el) el.value = val; };
    setOpt("optNiveau",   oo.niveau);
    setOpt("optType",     oo.type);
    setOpt("optLengte",   oo.lengte);
    setOpt("optRegister", oo.register);
    setOpt("optDoelgroep",oo.doelgroep);
    setOpt("optOpmaak",   oo.opmaak);
    const anoniemEl = $("#optAnoniem");
    if (anoniemEl) anoniemEl.checked = !!oo.anoniem;
    const inclusievBronEl = $("#optInclusievBron");
    if (inclusievBronEl) inclusievBronEl.checked = !!oo.inclusievBron;

    // Wire output options persistence
    const optIds = ["optNiveau","optType","optLengte","optRegister","optDoelgroep","optOpmaak"];
    const optKeys = ["niveau","type","lengte","register","doelgroep","opmaak"];
    optIds.forEach((id, i) => {
      const el = $("#" + id);
      if (el) el.addEventListener("change", () => {
        prefs.outputOptions[optKeys[i]] = el.value;
        savePrefs(prefs);
        updateSidebar();
      });
    });
    if (anoniemEl) anoniemEl.addEventListener("change", () => {
      prefs.outputOptions.anoniem = anoniemEl.checked;
      savePrefs(prefs);
      updateSidebar();
    });
    if (inclusievBronEl) inclusievBronEl.addEventListener("change", () => {
      prefs.outputOptions.inclusievBron = inclusievBronEl.checked;
      savePrefs(prefs);
      updateSidebar();
    });

    // UI language selector
    const uiLangSelect = $("#uiLangSelect");
    if (uiLangSelect) {
      uiLangSelect.value = currentLangCode;
      uiLangSelect.addEventListener("change", () => {
        currentLangCode = uiLangSelect.value;
        try { localStorage.setItem(UI_LANG_KEY, currentLangCode); } catch { /* noop */ }
        applyTranslations();
      });
    }

    // theme toggle
    $("#themeToggle").addEventListener("click", () => {
      const next = document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark";
      applyTheme(next);
    });

    // language persistence (summary output language)
    languageEl.addEventListener("change", () => {
      prefs.language = languageEl.value;
      savePrefs(prefs);
    });

    // transcript counter (no persistence – transcript is not saved)
    transcriptEl.addEventListener("input", () => {
      updateCharCount();
      updateStepStates();
    });

    const heroStartBtn = document.getElementById("heroStartBtn");
    if (heroStartBtn) {
      heroStartBtn.addEventListener("click", async (e) => {
        e.preventDefault();
        await resetSessionWorkflow();
        document.getElementById("step-1").scrollIntoView({ behavior: "smooth", block: "start" });
      });
    }
    $("#clearTranscript").addEventListener("click", () => {
      transcriptEl.value = "";
      updateCharCount();
      updateStepStates();
      transcriptEl.focus();
      const status = $("#fileStatus");
      if (status) { status.hidden = true; status.textContent = ""; }
    });

    // file upload
    const fileInput = $("#fileInput");
    const dropZone = $("#dropZone");
    $("#browseBtn").addEventListener("click", () => fileInput.click());
    fileInput.addEventListener("change", (e) => {
      if (e.target.files && e.target.files[0]) handleFile(e.target.files[0]);
      fileInput.value = "";
    });
    ["dragenter", "dragover"].forEach((ev) =>
      dropZone.addEventListener(ev, (e) => {
        e.preventDefault();
        dropZone.classList.add("dragover");
      })
    );
    ["dragleave", "drop"].forEach((ev) =>
      dropZone.addEventListener(ev, (e) => {
        e.preventDefault();
        dropZone.classList.remove("dragover");
      })
    );
    dropZone.addEventListener("drop", (e) => {
      if (e.dataTransfer.files && e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]);
    });

    // Extra context documents (optional)
    const extraFileInput = $("#extraFileInput");
    const extraDropZone = $("#extraDropZone");
    const extraBrowseBtn = $("#extraBrowseBtn");
    if (extraBrowseBtn && extraFileInput) {
      extraBrowseBtn.addEventListener("click", (e) => {
        e.preventDefault();
        extraFileInput.click();
      });
    }
    if (extraFileInput) {
      extraFileInput.addEventListener("change", (e) => {
        if (e.target.files && e.target.files.length) handleExtraFiles(e.target.files);
        extraFileInput.value = "";
      });
    }
    if (extraDropZone) {
      ["dragenter", "dragover"].forEach((ev) =>
        extraDropZone.addEventListener(ev, (e) => {
          e.preventDefault();
          extraDropZone.classList.add("dragover");
        })
      );
      ["dragleave", "drop"].forEach((ev) =>
        extraDropZone.addEventListener(ev, (e) => {
          e.preventDefault();
          extraDropZone.classList.remove("dragover");
        })
      );
      extraDropZone.addEventListener("drop", (e) => {
        if (e.dataTransfer.files && e.dataTransfer.files.length) handleExtraFiles(e.dataTransfer.files);
      });
    }

    // Tag manager
    renderTagManager();
    const addTagBtn = document.getElementById("addTagBtn");
    const newTagInput = document.getElementById("newTagInput");
    if (newTagInput) newTagInput.value = "";
    if (addTagBtn) addTagBtn.addEventListener("click", addTagFromInput);
    if (newTagInput) {
      newTagInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          addTagFromInput();
        }
      });
    }

    // Local scanner
    const selectLocalFolderBtn = document.getElementById("selectLocalFolderBtn");
    const scanLocalFolderBtn = document.getElementById("scanLocalFolderBtn");
    const linkSelectedToCreatorBtn = document.getElementById("linkSelectedToCreatorBtn");
    if (selectLocalFolderBtn) {
      selectLocalFolderBtn.addEventListener("click", () => {
        selectLocalFolder();
      });
    }
    if (scanLocalFolderBtn) {
      scanLocalFolderBtn.addEventListener("click", () => {
        scanLocalFolder();
      });
    }
    if (linkSelectedToCreatorBtn) {
      linkSelectedToCreatorBtn.addEventListener("click", openScannerLinkModal);
    }

    const scannerLinkCancel = document.getElementById("scannerLinkCancel");
    const scannerLinkConfirm = document.getElementById("scannerLinkConfirm");
    const scannerLinkModal = document.getElementById("scannerLinkModal");
    if (scannerLinkCancel) scannerLinkCancel.addEventListener("click", closeScannerLinkModal);
    if (scannerLinkConfirm) scannerLinkConfirm.addEventListener("click", linkSelectedScannerDocsToCreator);
    if (scannerLinkModal) {
      scannerLinkModal.addEventListener("click", (e) => {
        if (e.target === scannerLinkModal) closeScannerLinkModal();
      });
    }

    const scannerDetailsModal = document.getElementById("scannerDetailsModal");
    const scannerDetailsClose = document.getElementById("scannerDetailsClose");
    const scannerDetailsOk = document.getElementById("scannerDetailsOk");
    if (scannerDetailsClose) scannerDetailsClose.addEventListener("click", closeScannerDetailsModal);
    if (scannerDetailsOk) scannerDetailsOk.addEventListener("click", closeScannerDetailsModal);
    if (scannerDetailsModal) {
      scannerDetailsModal.addEventListener("click", (e) => {
        if (e.target === scannerDetailsModal) closeScannerDetailsModal();
      });
    }

    const introVideoTag = document.getElementById("introVideoTag");
    const introVideoModal = document.getElementById("introVideoModal");
    const introVideoClose = document.getElementById("introVideoClose");
    const introVideoCloseBottom = document.getElementById("introVideoCloseBottom");
    if (introVideoTag) introVideoTag.addEventListener("click", openIntroVideoModal);
    if (introVideoClose) introVideoClose.addEventListener("click", closeIntroVideoModal);
    if (introVideoCloseBottom) introVideoCloseBottom.addEventListener("click", closeIntroVideoModal);
    if (introVideoModal) {
      introVideoModal.addEventListener("click", (e) => {
        if (e.target === introVideoModal) closeIntroVideoModal();
      });
    }
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && introVideoModal && !introVideoModal.hidden) {
        closeIntroVideoModal();
      }
    });

    loadPersistedLocalFolder();

    // Step 2 mode switch + analysis options
    const modeSectionsBtn = document.getElementById("modeSectionsBtn");
    const modeAnalysisBtn = document.getElementById("modeAnalysisBtn");
    if (modeSectionsBtn) {
      modeSectionsBtn.addEventListener("click", () => {
        prefs.analysis.mode = "sections";
        savePrefs(prefs);
        renderStep2Mode();
        updateStepStates();
        updateSidebar();
      });
    }
    if (modeAnalysisBtn) {
      modeAnalysisBtn.addEventListener("click", () => {
        prefs.analysis.mode = "analysis";
        savePrefs(prefs);
        renderStep2Mode();
        updateStepStates();
        updateSidebar();
      });
    }
    const analysisTabReports = document.getElementById("analysisTabReports");
    const analysisTabOther = document.getElementById("analysisTabOther");
    if (analysisTabReports) {
      analysisTabReports.addEventListener("click", () => {
        setAnalysisTab("reports");
        renderAnalysisTab();
      });
    }
    if (analysisTabOther) {
      analysisTabOther.addEventListener("click", () => {
        setAnalysisTab("other");
        renderAnalysisTab();
      });
    }
    renderStep2Mode();

    // section toolbar
    $("#selectAll").addEventListener("click", () => setAll(true));
    $("#selectNone").addEventListener("click", () => setAll(false));
    $("#selectDefault").addEventListener("click", setDefault);
    $("#resetOrder").addEventListener("click", resetOrder);

    // generate + copy
    $("#generateBtn").addEventListener("click", generatePrompt);
    $("#copyPrompt").addEventListener("click", copyPrompt);
    
    const generateWithAIBtn = $("#generateWithAI");
    if (generateWithAIBtn) {
      generateWithAIBtn.addEventListener("click", () => {
        const prompt = promptOutput.textContent;
        callGeminiAPI(prompt);
      });
    }

    // result handling
    aiResultEl.addEventListener("input", () => {
      updatePreview();
      updateStepStates();
      updateHeroStartButtonLabel();
    });
    $("#viewPreview").addEventListener("click", () => {
      rawView = false;
      $("#viewPreview").classList.add("is-active");
      $("#viewRaw").classList.remove("is-active");
      updatePreview();
    });
    $("#viewRaw").addEventListener("click", () => {
      rawView = true;
      $("#viewRaw").classList.add("is-active");
      $("#viewPreview").classList.remove("is-active");
      updatePreview();
    });
    $("#downloadMd").addEventListener("click", () => download("md"));
    $("#downloadTxt").addEventListener("click", () => download("txt"));
    $("#copyResult").addEventListener("click", copyResult);

    // unlock / lock manual editing of the AI result
    $("#editResult").addEventListener("click", () => {
      const editBtn = $("#editResult");
      if (aiResultEl.disabled) {
        aiResultEl.disabled = false;
        editBtn.textContent = t("step5.lockBtn");
        aiResultEl.focus();
        toast(t("toast.editEnabled"));
      } else {
        aiResultEl.disabled = true;
        editBtn.textContent = t("step5.editBtn");
      }
    });

    // PWA Installation
    initPWA();
    initFooterAndLegal();
    updateHeroStartButtonLabel();
  }

  /* ---------- PWA Support ---------- */
  let deferredPrompt = null;
  let swRegistration = null;

  async function checkAppVersion() {
    try {
      const res = await fetch(`${VERSION_FILE}?t=${Date.now()}`, { cache: "no-store" });
      if (!res.ok) return;
      const data = await res.json();
      if (!data || !data.version) return;
      if (data.version !== currentAppVersion) {
        toast(`${t("toast.updateAvailable")} ${data.version}`, {
          onClick: () => window.location.reload(),
          duration: 9000
        });
      }
    } catch {
      // Silent: version checks should never break the app.
    }
  }

  function bindServiceWorkerUpdater(registration) {
    swRegistration = registration;

    if (registration.waiting) {
      toast(t("toast.updateInstall"), {
        onClick: () => requestServiceWorkerActivation(registration),
        duration: 9000
      });
    }

    registration.addEventListener("updatefound", () => {
      const newWorker = registration.installing;
      if (!newWorker) return;
      newWorker.addEventListener("statechange", () => {
        if (newWorker.state === "installed" && navigator.serviceWorker.controller) {
          toast(t("toast.updateInstall"), {
            onClick: () => requestServiceWorkerActivation(registration),
            duration: 9000
          });
        }
      });
    });

    navigator.serviceWorker.addEventListener("controllerchange", () => {
      window.location.reload();
    });

    setTimeout(() => registration.update().catch(() => {}), 2500);
    setInterval(() => {
      registration.update().catch(() => {});
      checkAppVersion();
    }, 5 * 60 * 1000);
  }

  function initPWA() {
    // Register Service Worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js', { scope: '/' })
        .then((registration) => {
          bindServiceWorkerUpdater(registration);
          checkAppVersion();
          console.log('✅ Service Worker registered');
        })
        .catch(err => console.log('Service Worker error:', err));
    }

    // Listen for install prompt
    window.addEventListener('beforeinstallprompt', event => {
      event.preventDefault();
      deferredPrompt = event;
      $("#installBtn").hidden = false; // Show install button
    });

    // Listen for successful app installation
    window.addEventListener('appinstalled', () => {
      console.log('✅ App installed');
      toast(t("toast.appInstalled"));
      deferredPrompt = null;
      $("#installBtn").hidden = true; // Hide button after install
    });

    // Install button click handler
    const installBtn = $("#installBtn");
    if (installBtn) {
      installBtn.addEventListener("click", async () => {
        if (!deferredPrompt) return;
        const confirmed = await requestInstallConfirmation();
        if (!confirmed) return;
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === 'accepted') {
          deferredPrompt = null;
        }
      });
    }
  }

  document.addEventListener("DOMContentLoaded", init);
})();
