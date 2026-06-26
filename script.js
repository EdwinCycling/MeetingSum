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

  const STORAGE_KEY = "meetsum.prefs.v1";
  const THEME_KEY   = "meetsum.theme";
  const UI_LANG_KEY = "meetsum.uilang";

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

  /* ---------- applyTranslations – sets every visible UI string ---------- */
  function applyTranslations() {
    document.documentElement.lang = t("html.lang");

    const set = (sel, key) => {
      const el = document.querySelector(sel);
      if (el) el.textContent = t(key);
    };
    const setHtml = (sel, key) => {
      const el = document.querySelector(sel);
      if (el) el.innerHTML = t(key);
    };
    const setAttr = (sel, attr, key) => {
      const el = document.querySelector(sel);
      if (el) el.setAttribute(attr, t(key));
    };

    // Header
    set(".nav-link",         "nav.start");
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

    // Summary language select options
    const langOptKeys = ["lang.option.nl","lang.option.en","lang.option.de","lang.option.fr","lang.option.es"];
    const summarySelect = document.getElementById("language");
    if (summarySelect) {
      [...summarySelect.options].forEach((opt, i) => {
        if (langOptKeys[i]) opt.text = t(langOptKeys[i]);
      });
    }

    // Step 2
    set("#step-2 h2",          "step2.title");
    set("#step-2 .step-desc",  "step2.desc");
    set("#selectAll",          "step2.selectAll");
    set("#selectNone",         "step2.selectNone");
    set("#selectDefault",      "step2.selectDefault");
    set("#resetOrder",         "step2.resetOrder");
    set(".sections-drag-hint", "step2.dragHint");

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
    // Step 3 select options
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
    set("#step4-h2",          "step4.title");
    set("#step4-desc",        "step4.desc");
    set("#generateBtn",       "step4.generateBtn");
    set("#step4-promptTitle", "step4.promptTitle");
    set("#copyPrompt",        "step4.copyPrompt");
    set("#generateWithAI",    "step4.generateWithAI");
    set("#step4-hint",        "step4.hint");
    set("#sidebarTitle",      "step4.sidebarTitle");

    // Step 5 – result
    set("#step5-h2",               "step5.title");
    set("#step5-desc",             "step5.desc");
    set("label[for='aiResult']",   "step5.label.result");
    setAttr("#aiResult", "placeholder", "step5.placeholder.result");
    // editResult – only update when in locked state (disabled textarea)
    const editBtn = document.getElementById("editResult");
    if (editBtn && aiResultEl && aiResultEl.disabled) {
      editBtn.textContent = t("step5.editBtn");
    }
    set("#viewPreview",  "step5.viewPreview");
    set("#viewRaw",      "step5.viewRaw");
    setAttr(".result-actions .toggle-group", "aria-label", "step5.ariaView");
    set("#copyResult",   "step5.copyResult");
    const emptyState = document.querySelector("#resultPreview .empty-state");
    if (emptyState) emptyState.textContent = t("step5.emptyState");

    // Footer
    setHtml(".site-footer p", "footer.text");

    // Loader modal
    set("#loaderTitle", "loader.title");

    // PIN modal
    set("#pinTitle",          "pin.title");
    set("#pinModal .modal-desc", "pin.desc");
    set("#pinCancel",         "pin.cancel");
    set("#pinSubmit",         "pin.submit");
    document.querySelectorAll("#pinInputs input").forEach((inp, i) => {
      inp.setAttribute("aria-label", t("pin.digit", i + 1));
    });

    // Re-render section list with new language + re-run counters
    renderSections();
    updateCharCount();
    updatePreview();
    updateSidebar();
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

  /* ---------- Render section checkboxes (with drag-to-reorder) ---------- */
  let dragSrcEl = null;

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
      const checked = !!prefs.sections[s.id];
      const label = document.createElement("label");
      label.className = "section-item" + (checked ? " checked" : "");
      label.draggable = true;
      label.dataset.id = s.id;
      label.innerHTML = `
        <span class="drag-handle" title="${t("step2.dragHandle.title")}" aria-hidden="true">⠿</span>
        <input type="checkbox" data-id="${s.id}" ${checked ? "checked" : ""} hidden />
        <span class="check" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg>
        </span>
        <span class="meta">
          <span class="title">${s.title}${s.tag ? `<span class="tag">${s.tag}</span>` : ""}</span>
          <span class="sub">${s.desc}</span>
        </span>`;

      const input = label.querySelector("input");
      input.addEventListener("change", () => {
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
    SECTION_DEFS.forEach((s) => (prefs.sections[s.id] = value));
    savePrefs(prefs);
    renderSections();
  }
  function setDefault() {
    SECTION_DEFS.forEach((s) => (prefs.sections[s.id] = s.def));
    savePrefs(prefs);
    renderSections();
  }
  function resetOrder() {
    prefs.sectionOrder = SECTION_DEFS.map((s) => s.id);
    savePrefs(prefs);
    renderSections();
    toast(t("toast.orderReset"));
  }

  /* ---------- Prompt generation ---------- */
  function buildPrompt() {
    const transcript = transcriptEl.value.trim();
    const langNames = getLang()["summaryLangNames"] || {};
    const language = langNames[languageEl.value] || languageEl.value;
    // Use the user's custom order, filtered to selected sections only.
    const orderedIds = prefs.sectionOrder || SECTION_DEFS.map((s) => s.id);
    const sectionMap = getSectionMap();
    const selected = orderedIds
      .map((id) => sectionMap[id])
      .filter((s) => s && prefs.sections[s.id]);

    const sectionInstructions = selected
      .map((s, i) => `${i + 1}. ${s.prompt}`)
      .join("\n\n");
    const headingList = selected.map((s) => `- ${s.title}`).join("\n");

    const tpl = getLang()["promptTemplate"];
    return tpl
      ? tpl(language, headingList, sectionInstructions, transcript, prefs.outputOptions || OUTPUT_DEFAULTS)
      : `${headingList}\n\n${sectionInstructions}\n\n${transcript}`;
  }

  /* ---------- Step state management ---------- */
  function updateStepStates() {
    const hasTranscript = transcriptEl.value.trim().length > 30;
    const anySection = SECTION_DEFS.some((s) => prefs.sections[s.id]);
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
    if (!list) return;
    const orderedIds = prefs.sectionOrder || SECTION_DEFS.map((s) => s.id);
    const sectionMap = getSectionMap();
    const selected = orderedIds.map((id) => sectionMap[id]).filter((s) => s && prefs.sections[s.id]);
    list.innerHTML = selected.map((s) =>
      `<li class="sidebar-item"><strong>${s.title}</strong><span>${s.desc}</span></li>`
    ).join("") || `<li class="sidebar-empty">${t("toast.noSection")}</li>`;
  }

  function generatePrompt() {
    const anySelected = SECTION_DEFS.some((s) => prefs.sections[s.id]);
    if (!anySelected) {
      toast(t("toast.noSection"));
      return;
    }
    if (!transcriptEl.value.trim()) {
      toast(t("toast.noTranscript"));
    }
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
    prefs.aiResult = text;
    savePrefs(prefs);
    aiResultEl.disabled = true;
    const editBtn = $("#editResult");
    if (editBtn) {
      editBtn.textContent = t("step5.editBtn");
      editBtn.hidden = !text.trim();
    }
    updatePreview();
    updateStepStates();
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
  function toast(msg) {
    const el = $("#toast");
    el.textContent = msg;
    el.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove("show"), 2600);
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
    // Restore AI result if present
    if (prefs.aiResult) {
      aiResultEl.value = prefs.aiResult;
      const editBtn = $("#editResult");
      if (editBtn && prefs.aiResult.trim()) editBtn.hidden = false;
      updatePreview();
    }
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
      });
    });
    if (anoniemEl) anoniemEl.addEventListener("change", () => {
      prefs.outputOptions.anoniem = anoniemEl.checked;
      savePrefs(prefs);
    });
    if (inclusievBronEl) inclusievBronEl.addEventListener("change", () => {
      prefs.outputOptions.inclusievBron = inclusievBronEl.checked;
      savePrefs(prefs);
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
      prefs.aiResult = aiResultEl.value;
      savePrefs(prefs);
      updatePreview();
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
  }

  /* ---------- PWA Support ---------- */
  let deferredPrompt = null;

  function initPWA() {
    // Register Service Worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js', { scope: '/' })
        .then(() => console.log('✅ Service Worker registered'))
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
