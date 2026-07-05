/* =========================================================
   MeetingSum – English translations
   ========================================================= */
window.LANG_EN = {
  "html.lang": "en",
  "common.enabled": "Enabled",
  "common.disabled": "Disabled",
  "common.required": "Required",

  /* ---- Header / nav ---- */
  "nav.start": "Get started",
  "install.label": "Install",
  "install.title": "Install as app",
  "install.ariaLabel": "Install MeetingSum",
  "theme.ariaLabel": "Toggle between light and dark theme",
  "theme.title": "Toggle theme",
  "uiLang.ariaLabel": "Interface language",

  /* ---- Hero ---- */
  "hero.pill": "\u2728 The nr.1 AI Prompt Generator",
  "hero.h1": "From raw transcript to",
  "hero.h1.accent": "a razor-sharp summary",
  "hero.sub": "Paste your (Teams) transcript or any other document, choose exactly which sections you want to include and how you want the output to look, and MeetingSum builds a professional AI prompt for you. No noise, just results.",
  "hero.cta.start": "Start now \u2192",
  "hero.cta.newSession": "New session",
  "hero.cta.sections": "View sections",
  "hero.badge.local": "\uD83D\uDD12 100% local in your browser",
  "hero.badge.langs": "\uD83C\uDF0D 5 languages",
  "hero.badge.prefs": "\uD83D\uDCBE Remembers your preferences",

  /* ---- Step 1 ---- */
  "step1.title": "Transcript & Language",
  "step1.desc": "Paste your full Teams transcript and choose the language for your summary.",
  "step1.label.transcript": "Teams transcript",
  "step1.drop.strong": "Drop a file here",
  "step1.drop.or": "or",
  "step1.drop.browse": "browse",
  "step1.drop.hint": ".txt \u00b7 .md \u00b7 .pdf \u00b7 .docx",
  "step1.placeholder.transcript": "\u2026or paste your MS Teams transcript here\n\nE.g.:\n[00:00] John Smith: Welcome everyone to the weekly sprint review\u2026",
  "step1.charCount": function (n) { return n.toLocaleString("en-US") + " character" + (n === 1 ? "" : "s"); },
  "step1.clear": "Clear",
  "step1.label.summaryLang": "Summary language",
  "lang.option.nl": "\uD83C\uDDF3\uD83C\uDDF1 Dutch",
  "lang.option.en": "\uD83C\uDDEC\uD83C\uDDE7 English",
  "lang.option.de": "\uD83C\uDDE9\uD83C\uDDEA German",
  "lang.option.fr": "\uD83C\uDDEB\uD83C\uDDF7 French",
  "lang.option.es": "\uD83C\uDDEA\uD83C\uDDF8 Spanish",

  /* ---- Step 2 ---- */
  "step2.title": "Select sections",
  "step2.desc": "Check which parts should appear in the summary. Your selection is remembered.",
  "step2.analysis.title": "Choose analysis prompt",
  "step2.analysis.desc": "Choose exactly 1 analysis option. In this mode, sections are not used.",
  "step2.mode.sections": "Section mode",
  "step2.mode.analysis": "Analysis mode",
  "step2.analysis.intro": "Choose 1 analysis type. MeetingSum builds a focused prompt from your transcript.",
  "step2.analysis.tabs.aria": "Analysis categories",
  "step2.analysis.focus": "Prompt focus",
  "step2.analysis.tab.strategy": "Strategy",
  "step2.analysis.tab.organization": "Organization",
  "step2.analysis.tab.process": "Process",
  "step2.analysis.tab.risk": "Risk",
  "step2.analysis.tab.insights": "Insights",
  "step2.analysis.tab.content": "Content",
  "step2.analysis.tab.education": "Education",
  "step2.analysis.tab.tools": "Tools",
  "step2.analysis.tab.custom": "Custom instructions",
  "step2.analysis.group.strategy.title": "Strategic Models",
  "step2.analysis.group.strategy.desc": "Frameworks for market direction, positioning, and growth choices.",
  "step2.analysis.group.organization.title": "Organization & Change",
  "step2.analysis.group.organization.desc": "Models for alignment, adoption, and stakeholder dynamics.",
  "step2.analysis.group.process.title": "Process & Execution",
  "step2.analysis.group.process.desc": "Analyze workflows, decision quality, and operational structure.",
  "step2.analysis.group.risk.title": "Risk & Control",
  "step2.analysis.group.risk.desc": "Prioritize risks, define mitigation, and track progress.",
  "step2.analysis.group.insights.title": "Insights & Signals",
  "step2.analysis.group.insights.desc": "Fast analysis for patterns, sentiment, and unresolved points.",
  "step2.analysis.group.content.title": "Content Outputs",
  "step2.analysis.group.content.desc": "Generate ready-to-use outputs such as business case, blog, and posts.",
  "step2.analysis.group.education.title": "Education",
  "step2.analysis.group.education.desc": "Learning-focused formats to explain and deepen topics.",
  "step2.analysis.group.tools.title": "Interactive Tools",
  "step2.analysis.group.tools.desc": "Direct formats like quiz and HTML dashboard.",
  "step2.analysis.group.custom.title": "Custom Instructions",
  "step2.analysis.group.custom.desc": "Store your own prompt instructions locally and use them directly in your analysis flow.",
  "step2.analysis.focus": "Prompt focus",
  "step2.analysis.custom.note": "These instructions are stored only locally in this browser. There is no database and nothing leaves this environment.",
  "step2.analysis.custom.titleLabel": "Name (title)",
  "step2.analysis.custom.titlePlaceholder": "E.g. Custom team summary",
  "step2.analysis.custom.descLabel": "Instruction description",
  "step2.analysis.custom.descPlaceholder": "Describe in clear sentences which prompt rule or analysis instruction you want to add.",
  "step2.analysis.custom.modalTitle": "Add custom instruction",
  "step2.analysis.custom.modalDesc": "These instructions stay local in this browser and are added directly to your analysis prompt.",
  "step2.analysis.custom.editModalTitle": "Edit custom instruction",
  "step2.analysis.custom.editModalDesc": "Adjust this instruction and save the change locally in this browser.",
  "step2.analysis.custom.open": "New custom instruction",
  "step2.analysis.custom.overview": "Custom instructions overview",
  "step2.analysis.custom.overviewTitle": "Custom instructions overview",
  "step2.analysis.custom.overviewDesc": "View all your locally stored custom instructions here and import or download them as a text file.",
  "step2.analysis.custom.import": "Import file",
  "step2.analysis.custom.export": "Download as text",
  "step2.analysis.custom.exporting": "Text file created.",
  "step2.analysis.custom.imported": "{count} instructions imported.",
  "step2.analysis.custom.importNoItems": "No valid instructions found in the file.",
  "step2.analysis.custom.importDuplicate": "These instructions are already in your list.",
  "step2.analysis.custom.importFailed": "Import failed.",
  "step2.analysis.custom.overviewEmpty": "No custom instructions added yet.",
  "step2.analysis.custom.add": "Add to list",
  "step2.analysis.custom.cancel": "Cancel",
  "step2.analysis.custom.listTitle": "Added items",
  "step2.analysis.custom.listDesc": "Your entered prompt instructions.",
  "step2.analysis.custom.empty": "No custom instructions added yet.",
  "step2.analysis.custom.localBadge": "Local",
  "step2.analysis.custom.cardNote": "Stored locally only",
  "step2.analysis.custom.selectedBadge": "Selected",
  "step2.analysis.custom.openDetail": "More",
  "step2.analysis.custom.detailTitle": "Prompt details",
  "step2.analysis.custom.detailDesc": "Review the full prompt, edit it, or choose whether to select it.",
  "step2.analysis.custom.detailCancel": "Cancel",
  "step2.analysis.custom.detailEdit": "Edit",
  "step2.analysis.custom.saveEdit": "Save",
  "step2.analysis.custom.detailUse": "Select",
  "step2.analysis.custom.exportHeader": "Export date",
  "step2.analysis.custom.exportLanguage": "Language",
  "step2.analysis.custom.exportInstruction": "Instruction",
  "step2.analysis.selectedInTab": "Selected prompt",
  "step2.analysis.custom.remove": "Remove",
  "step2.analysis.custom.added": "Custom instruction added.",
  "step2.analysis.custom.updated": "Custom instruction saved.",
  "step2.analysis.custom.savedLocal": "Custom instruction saved locally.",
  "step2.analysis.custom.removed": "Custom instruction removed.",
  "step2.analysis.custom.selected": "Custom instruction selected.",
  "step2.analysis.custom.validation": "Please fill in both the title and the instruction description.",
  "step2.analysis.noneSelected": "No analysis selected",
  "step2.selectAll": "Select all",
  "step2.selectNone": "Select none",
  "step2.selectDefault": "Default set",
  "step2.resetOrder": "Reset order",
  "step2.dragHint": "\u283f Drag a block to adjust the order",
  "step2.dragHandle.title": "Drag to change order",

  /* ---- Step 3: output options ---- */
  "step3.title": "Output options",
  "step3.desc": "Adjust the level, style and format of the summary to your needs.",
  "step3.niveau.label": "Level",
  "step3.niveau.simpel": "Simple (primary school)",
  "step3.niveau.middelbaar": "Secondary school",
  "step3.niveau.professioneel": "Professional (default)",
  "step3.niveau.technisch": "Technical / jargon",
  "step3.niveau.expert": "Expert / executive level",
  "step3.type.label": "Document type",
  "step3.type.verslag": "Minutes / report",
  "step3.type.blog": "Blog post",
  "step3.type.verhaal": "Story / narrative",
  "step3.type.memo": "Short memo",
  "step3.type.email": "Email update",
  "step3.type.presentatie": "Presentation bullets",
  "step3.lengte.label": "Length",
  "step3.lengte.kort": "Short and punchy",
  "step3.lengte.standaard": "Standard",
  "step3.lengte.uitgebreid": "Detailed (all details)",
  "step3.register.label": "Writing style",
  "step3.register.informeel": "Informal (casual)",
  "step3.register.neutraal": "Neutral / business",
  "step3.register.formeel": "Formal",
  "step3.anoniem.label": "Anonymise",
  "step3.anoniem.hint": "Replace names with Employee 1, Employee 2, ...",
  "step3.inclusievBron.label": "Include source references",
  "step3.inclusievBron.hint": "Add sources in [*italic format*]",
  "step3.doelgroep.label": "Audience",
  "step3.doelgroep.team": "Internal team",
  "step3.doelgroep.management": "Management / executive",
  "step3.doelgroep.extern": "External stakeholders",
  "step3.doelgroep.klant": "Customer",
  "step3.opmaak.label": "Layout preference",
  "step3.opmaak.auto": "Automatic",
  "step3.opmaak.bullets": "Bullet points",
  "step3.opmaak.paragrafen": "Paragraphs",

  /* ---- Step 4: generate prompt ---- */
  "step4.title": "Generate your AI prompt",
  "step4.desc": "MeetingSum builds a complete, structured prompt based on your choices.",
  "step4.generateBtn": "\u26a1 Generate AI prompt",
  "step4.promptTitle": "Your AI prompt",
  "step4.copyPrompt": "\uD83D\uDCCB Copy prompt",
  "step4.generateWithAI": "\uD83D\uDD12 Generate via AI",
  "step4.hint": "If you want to create the summary safely through a company AI account, copy the prompt and run it in your Copilot environment, for example. The prompt also contains your source text, so one copy action gets you ready and keeps the workflow safe.",
  "step4.sidebarTitle": "Selected sections",
  "step4.sidebarOutputTitle": "Output settings",

  /* ---- Step 5: result ---- */
  "step5.title": "Result & download",
  "step5.desc": "The AI summary appears here automatically after analysis. You can then edit, copy and download it.",
  "step5.label.result": "AI summary (Markdown supported)",
  "step5.editBtn": "\u270f\ufe0f Edit",
  "step5.lockBtn": "\uD83D\uDD12 Lock",
  "step5.placeholder.result": "No result yet - use step 4 and click 'Generate with AI'.",
  "step5.viewPreview": "\uD83D\uDC41\ufe0f Preview",
  "step5.viewRaw": "\uD83D\uDCC4 Markdown",
  "step5.ariaView": "View",
  "step5.copyResult": "\uD83D\uDCCB Copy",
  "step5.emptyState": "No result yet. First generate a summary with AI in step 4.",

  /* ---- Footer ---- */
  "footer.text": "Built from frustration with scattered meeting notes and shaped into <strong>MeetingSum</strong> for better standardisation, speed and teamwork.",
  "footer.version": "Version",
  "footer.tagline": "Entrepreneurial, professional and human by design for sharper summaries.",
  "footer.disclaimer": "Disclaimer",
  "footer.cookies": "Cookies",
  "footer.team": "Team",
  "footer.pricing": "Pricing & safety",

  /* ---- Cookie sheet ---- */
  "cookie.kicker": "Cookie & storage notice",
  "cookie.title": "This app only uses functional storage",
  "cookie.text": "MeetingSum uses local storage for preferences, language settings and optionally a temporary PIN session. No advertising or tracking cookies are placed.",
  "cookie.more": "Read details",
  "cookie.close": "Close",

  /* ---- Info modal ---- */
  "modal.close": "Close",
  "install.modal.title": "Install MeetingSum as an app",
  "install.modal.desc": "After installation, MeetingSum opens as a standalone app on your device with faster startup and direct access from your Start menu or desktop.",
  "install.modal.cancel": "Cancel",
  "install.modal.confirm": "Continue",
  "legal.disclaimer.title": "Disclaimer",
  "legal.disclaimer.body": "<p><strong>MeetingSum</strong> helps you get to a usable prompt and summary faster, but you remain responsible for checking the output for accuracy, completeness and suitability.</p><p>Do not use the built-in analysis or AI connection for confidential, protected or otherwise sensitive data unless you are working in your own secured environment. Only share what you can responsibly process there.</p><p>The makers are not liable for direct or indirect damage, incorrect interpretations, missed decisions or unwanted data sharing resulting from the use of this tool.</p>",
  "legal.cookies.title": "Cookies & local storage",
  "legal.cookies.body": "<p>MeetingSum does not use advertising or tracking cookies.</p><p>The app does use local browser storage to remember your preferences, such as selected sections, output settings, theme, interface language and, if applicable, a temporary PIN session. This stays inside your browser and is not used to build marketing profiles.</p><p>If you want to remove this data, you can clear the local storage for this site in your browser settings.</p>",
  "legal.team.title": "The team behind MeetingSum",
  "legal.team.body": "<p>MeetingSum was built out of frustration: too many meetings, too many scattered notes and too little standardisation in the final output.</p><p>So we created a tool for everyone who wants to summarise faster, more consistently and with less noise. Practical. Human. Reliable.</p><p>We like to describe ourselves as a team of the best vibe coders in the Netherlands: entrepreneurial, creative, technically sharp and always looking for workflows people will actually use.</p>",
  "legal.pricing.title": "Pricing & safety",
  "legal.pricing.body": "<p>MeetingSum is free to use!</p><p>We only build the prompts for your analysis based on your input.</p><p>NOTHING stays with us. We do not have a database to store data, everything remains local in your environment.</p><p>We send NOTHING to an AI model for analysis. You do that yourself in your secured environment.</p>",

  /* ---- Loader ---- */
  "loader.title": "Generating summary\u2026",
  "loader.initial": "Please wait, the AI is analysing your transcript.",
  "loader.stage1": "Preparing transcript\u2026",
  "loader.stage2": "Connecting to AI model\u2026",
  "loader.stage3": "The AI is analysing your meeting\u2026",
  "loader.stage4": "Writing summary\u2026",
  "loader.stage5": "Almost done\u2026",
  "loader.done": "Done! \uD83C\uDF89",

  /* ---- PIN modal ---- */
  "pin.title": "Enter your PIN",
  "pin.desc": "This PIN protects the use of your Google API key.",
  "pin.cancel": "Cancel",
  "pin.submit": "Unlock",
  "pin.checking": "Checking\u2026",
  "pin.digit": function (n) { return "Digit " + n; },
  "pin.error.digits": "Please enter 4 digits.",
  "pin.error.invalid": "Incorrect PIN",
  "pin.error.server": "Server error. Please try again.",

  /* ---- Toasts ---- */
  "toast.orderReset": "Order reset to default.",
  "toast.noSection": "Please select at least one section first.",
  "toast.noTranscript": "Tip: paste a transcript for the best result.",
  "toast.resultRefreshed": "\u2705 Result refreshed!",
  "toast.appInstalled": "\u2705 MeetingSum is installed!",
  "toast.promptCopied": "Prompt copied! \uD83D\uDCCB",
  "toast.resultCopied": "Summary copied! \uD83D\uDCCB",
  "toast.updateAvailable": "Update available - click to refresh to version",
  "toast.updateInstall": "New app update ready - click to install",
  "toast.downloaded": function (ext) { return "Downloaded as ." + ext; },
  "toast.fileLoaded": function (name) { return "File loaded: " + name; },
  "toast.editEnabled": "Editing enabled \u270f\ufe0f",

  /* ---- Buttons ---- */
  "btn.generating": "\u23f3 Generating...",

  /* ---- File handling ---- */
  "file.tooBig": "\u274c File too large (max 15 MB)",
  "file.noText": "No text found in file.",
  "file.unsupported": "Unsupported file type.",
  "file.docOld": "Old .doc format is not supported. Save as .docx or .txt.",
  "file.pdfNotLoaded": "PDF parser not loaded (internet required).",
  "file.wordNotLoaded": "Word parser not loaded (internet required).",

  /* ---- Download ---- */
  "download.filename": function (date, ext) { return "meetsum-summary-" + date + "." + ext; },

  /* ---- Extra context documents ---- */
  "extra.summary": "Add extra documents (optional)",
  "extra.intro": "Add up to 3 extra documents (e.g. summaries of previous MeetingSum sessions) as context for progress. As soon as you add at least one, extra options appear in step 2 to use this context. Preferably use previous MeetingSum summaries; a raw transcript is also allowed if you really want.",
  "extra.drop.strong": "Drop extra documents here",
  "extra.drop.hint": "Max 3 \u00b7 .txt \u00b7 .md \u00b7 .pdf \u00b7 .docx",
  "extra.badge": "Extra",
  "extra.remove": "Remove",
  "extra.removed": "Extra document removed.",
  "extra.added": function (name) { return "Extra document added: " + name; },
  "extra.maxReached": function (n) { return "Maximum of " + n + " extra documents."; },
  "extra.chars": function (n) { return n.toLocaleString("en-US") + " characters"; },
  "extra.sidebarDocs": function (n) { return n + " extra document" + (n === 1 ? "" : "s"); },
  "extra.docWrap": function (n, name, text) {
    return "--- EXTRA DOCUMENT " + n + ": " + name + " ---\n" + text + "\n--- END EXTRA DOCUMENT " + n + " ---";
  },
  "ctx.title": "Options using your extra documents",
  "ctx.desc": "These options use the documents you added in step 1. Check what you want to do with the previous sessions.",

  /* ---- Confirm dialog ---- */
  "confirm.defaultTitle": "Are you sure?",
  "confirm.yes": "Yes",
  "confirm.no": "No",
  "confirm.extraTitle": "Not using the extra documents?",
  "confirm.extraDesc": function (n) { return "You added " + n + " extra document" + (n === 1 ? "" : "s") + ", but did not check any option to use them. The extra documents will then NOT be included in the prompt. Continue anyway?"; },
  "confirm.extraYes": "Yes, continue without",
  "confirm.extraNo": "No, go back",

  /* ---- Summary target language names (value → name in prompt) ---- */
  "summaryLangNames": {
    "Nederlands": "Dutch",
    "Engels": "English",
    "Duits": "German",
    "Frans": "French",
    "Spaans": "Spanish"
  },

  /* ---- Section definitions ---- */
  "sections": {
    "doel": {
      title: "Meeting Goal",
      desc: "Short opening sentence and the main reason for this meeting.",
      prompt: "**Meeting Goal**: Start with a brief opening sentence describing the main goal and most important reason for this meeting (1-2 sentences)."
    },
    "hoofdpunten": {
      title: "Key Points (Discussion)",
      desc: "Essence of the discussions per topic with bullet points.",
      prompt: "**Key Points (Discussion)**: Summarise the essence of the discussions grouped by topic. Use a short heading per topic followed by bullet points with the key points."
    },
    "beslissingen": {
      title: "Decisions Made",
      desc: "Everything that was definitively agreed or approved.",
      prompt: "**Decisions Made**: List in a clear bullet list everything that was definitively agreed, decided or approved. Be concrete and unambiguous."
    },
    "actiepunten": {
      title: "Action Items",
      desc: "In a SMART-formatted table (What/Task | Who | When).",
      prompt: "**Action Items**: Present all action items in a Markdown table with columns | What/Task | Who | When |. Formulate each task SMART (Specific, Measurable, Achievable, Relevant, Time-bound). Use 'Unknown' if an owner or deadline cannot be derived from the transcript."
    },
    "parkeerplaats": {
      title: "Parking Lot & Next Steps",
      desc: "Off-scope topics + agreements for the next meeting.",
      prompt: "**Parking Lot & Next Steps**: Mention topics that were out of scope or postponed, and describe the concrete agreements or agenda for the next meeting."
    },
    "executive": {
      title: "Executive Summary",
      desc: "Short, powerful summary for management (3-5 sentences).",
      prompt: "**Executive Summary**: Write a short, powerful summary (3-5 sentences) aimed at management. Focus on outcomes, impact and decisions, not details."
    },
    "slotzin": {
      title: "Closing Statement",
      desc: "A motivating or summarising closing remark.",
      prompt: "**Closing Statement**: End with one motivating or summarising closing remark that concludes the meeting positively."
    },
    "details": {
      title: "Meeting Details",
      desc: "Date, time and attendees (if derivable from transcript).",
      prompt: "**Meeting Details**: State the date, time and attendees as far as these can be derived from the transcript. Omit fields or mark as 'Not mentioned' when information is missing; do not invent anything."
    },
    "verbeterpunten": {
      title: "Areas for Improvement",
      desc: "What could have been better in the process or the meeting?",
      prompt: "**Areas for Improvement**: List in bullet points what could have been better in the process or the meeting itself (structure, preparation, decision-making, etc.)."
    },
    "goedpunten": {
      title: "What Went Well",
      desc: "What went smoothly or positively?",
      prompt: "**What Went Well**: List in bullet points what went smoothly or positively during the meeting."
    },
    "sentiment": {
      title: "Sentiment & Atmosphere",
      desc: "The overall tone of the conversation (constructive, tense, enthusiastic, etc.).",
      prompt: "**Sentiment & Atmosphere**: Describe the overall tone and atmosphere of the conversation (e.g. constructive, tense, enthusiastic) with a brief justification based on the transcript."
    },
    "risicos": {
      title: "Risks & Issues",
      desc: "Potential dangers or obstacles.",
      tag: "Extra",
      prompt: "**Risks & Issues**: Identify in bullet points potential risks, dangers or obstacles that were mentioned or implicitly follow from the discussion."
    },
    "tags": {
      title: "Keywords / Tags",
      desc: "5-10 relevant tags that cover the meeting's main themes.",
      tag: "Extra",
      prompt: "**Keywords / Tags**: Provide 5 to 10 relevant keywords or tags that cover the meeting's main themes, as a comma-separated list."
    },
    "quotes": {
      title: "Important Quotes",
      desc: "2-3 striking quotes from participants.",
      tag: "Extra",
      prompt: "**Important Quotes**: Select 2 to 3 striking, literal quotes from participants and mention where possible who said it. Only quote what is actually in the transcript."
    }
  },

  /* ---- Context option definitions (only used with extra documents) ---- */
  "contextOptions": {
    "recap": {
      title: "Recap of previous sessions",
      desc: "Very short summary of the previous meetings.",
      prompt: "Add a section **Recap of previous sessions**: a very short summary (max 3-5 bullets) of the previous meetings, based solely on the extra documents."
    },
    "progress": {
      title: "Progress vs. previous sessions",
      desc: "What is done, what is still open, what is new.",
      prompt: "Add a section **Progress vs. previous sessions**: compare the current meeting with the extra documents and describe what has been completed, what is still in progress and what is new."
    },
    "openActions": {
      title: "Status of earlier action items",
      desc: "Follow up on open actions from previous sessions.",
      prompt: "Add a section **Status of earlier action items**: take the action items from the extra documents and indicate for each whether it was completed in this meeting, is still open or has changed. Use a Markdown table with columns | Action item | Previous status | Current status |."
    },
    "decisions": {
      title: "Evolution of decisions",
      desc: "How earlier decisions were changed or confirmed.",
      prompt: "Add a section **Evolution of decisions**: describe which earlier decisions from the extra documents were confirmed, revised or reversed in this meeting."
    },
    "recurring": {
      title: "Recurring themes",
      desc: "The common thread across multiple sessions.",
      prompt: "Add a section **Recurring themes**: name topics or issues that recur both in the extra documents and in this meeting (the common thread)."
    },
    "deviations": {
      title: "Deviations and new insights",
      desc: "What deviates from or is new vs. earlier documents.",
      prompt: "Add a section **Deviations and new insights**: point out where this meeting deviates from, or adds new insights to, the extra documents."
    }
  },

  /* ---- Extra context block template ---- */
  "extraContextTemplate": function (optionInstructions, docsBlock) {
    return `# EXTRA CONTEXT DOCUMENTS (BACKGROUND \u2014 NOT PART OF THE MAIN TRANSCRIPT)
The documents below are SUPPORTING background material, usually summaries of previous MeetingSum sessions or earlier reports. They serve EXCLUSIVELY as context for progress.

IMPORTANT \u2014 avoid confusion in the output:
- Do NOT summarise these documents as if they were the current meeting.
- The content of the CURRENT meeting comes EXCLUSIVELY from the INPUT TRANSCRIPT above.
- Use the documents below only for the context tasks requested below.
- If something appears only in these extra documents (and not in the transcript), present it explicitly as background/history, not as something that happened in this meeting.

## USE THE EXTRA DOCUMENTS FOR THE FOLLOWING TASKS
${optionInstructions}

## CONTENT OF THE EXTRA DOCUMENTS
${docsBlock}`;
  },

  /* ---- AI prompt template ---- */
  "promptTemplate": function (language, headingList, sectionInstructions, transcript, opts) {
    opts = opts || {};
    var niveauMap = {
      simpel: "Write at a level accessible to people without specialist knowledge. Use short sentences and simple words; avoid jargon.",
      middelbaar: "Write at a secondary school level. Accessible but not simplistic.",
      professioneel: "Write professionally and in a business style. Suitable for a broad office audience.",
      technisch: "Use technical jargon and detailed terminology where appropriate.",
      expert: "Write at an executive and expert level. High information density and strategic language."
    };
    var typeMap = {
      verslag: "Structure as a formal meeting report with clear headings per section.",
      blog: "Structure as an informative blog post with an introduction, body and conclusion.",
      verhaal: "Tell as a cohesive story with smooth transitions between sections.",
      memo: "Structure as a concise internal memo: short, to the point and bullet-heavy.",
      email: "Structure as a professional email update for colleagues or management.",
      presentatie: "Provide only bullet points and key messages, suitable for presentation slides."
    };
    var lengteMap = {
      kort: "Keep the total summary concise: no more than half an A4 page.",
      standaard: "Use a standard length: complete but without unnecessary repetition.",
      uitgebreid: "Be detailed and thorough: include all relevant details."
    };
    var registerMap = {
      informeel: "Use an informal writing style. Address the reader in a casual, friendly tone.",
      neutraal: "Use a neutral, business-like writing style without direct address.",
      formeel: "Use a formal writing style and formal language throughout."
    };
    var doelgroepMap = {
      team: "The summary is for the immediate team: include operational details.",
      management: "The summary is for management: focus on strategic outcomes and decisions.",
      extern: "The summary is for external stakeholders: be cautious with internal information.",
      klant: "The summary is for a customer: professional, customer-focused and free of internal jargon."
    };
    var opmaakMap = {
      auto: "",
      bullets: "Prefer bullet points and lists; minimise running text.",
      paragrafen: "Write in continuous prose and paragraphs; avoid bullet points."
    };
    var extraRules = [
      niveauMap[opts.niveau] || niveauMap.professioneel,
      typeMap[opts.type] || typeMap.verslag,
      lengteMap[opts.lengte] || lengteMap.standaard,
      registerMap[opts.register] || registerMap.neutraal,
      doelgroepMap[opts.doelgroep] || doelgroepMap.team,
      opmaakMap[opts.opmaak] || "",
      opts.anoniem ? "Replace all personal names with anonymous identifiers: Employee 1, Employee 2, etc. Keep the numbering consistent throughout the document." : "",
      opts.inclusievBron ? "Add source references in the format: [*direct quote or context from the transcript*]. NEVER place these in the main text; integrate them only where relevant with italic brackets." : ""
    ].filter(Boolean).map(function(r) { return "- " + r; }).join("\n");

    return `# EXPERT MEETING ANALYST ADVISOR
You are an expert meeting analyst with 10+ years of experience extracting value from complex discussions. You are precise, objective and stick to facts. You never invent information.

# CORE FOCUS AREAS
Extract ONLY:
- Concrete action items with clear owners
- Definitive decisions and approvals
- Key risks and issues
- Strategic outcomes and impact

Do NOT include:
- Background information and context without action
- General discussion points without a decision
- Anecdotes and off-topic remarks
- Passing speculation

# CONSTRAINTS
1. Always be concrete: no vagueness or theoretical statements
2. Trace everything back to the transcript: never invent
3. Missing information: EXPLICITLY mark as 'Not mentioned' or 'TBD'
4. Assign an owner EVEN IF implied: use roles/departments if names are missing
5. Deadlines: look for explicit mentions OR infer from context (e.g. "next week", "by end of month")

# WRITING GUIDELINES
${extraRules}

# SECTIONS TO COVER
Analyse in this order:
${headingList || "- (No sections selected)"}

# INSTRUCTIONS PER SECTION
${sectionInstructions || ""}

# LANGUAGE
Analyse the transcript in any language, but write the final result EXCLUSIVELY in ${language}.

# INPUT TRANSCRIPT
\`\`\`
${transcript || "[Paste your Teams transcript here]"}
\`\`\``;
  }
};

