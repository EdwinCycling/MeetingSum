# RecapHorizon Analyse Prompts

Dit document bevat alle analyse functies die momenteel worden gebruikt in RecapHorizon. Voor elke functie is de prompt structuur gedocumenteerd, inclusief de velden/parameters die nodig zijn om de prompt in een andere applicatie te bouwen zonder een API call uit te voeren.

## 1. Aanbevolen Tabverdeling (Analyse Modus)
Doel: duidelijkheid voor de gebruiker en niet te veel opties per tab.

### Strategie
- BCG Groei-Aandeel Matrix
- SWOT Analyse
- Porter Vijfkrachtenmodel
- PESTEL Omgevingsanalyse
- Blue Ocean Audit
- McKinsey 3 Horizons
- Ansoff Matrix
- GE-McKinsey Portfolio

### Organisatie
- McKinsey 7S Assessment
- McKinsey Influence Model
- ADKAR Verandermodel
- Kotter 8-stappen Audit
- Stakeholder Macht-Interesse Matrix
- Cultureel Web Assessment
- Strategische Alignment

### Proces
- Porter Waardeketen
- MECE Issue Tree
- SIPOC Procesmap
- Ishikawa + 5 Whys
- Kepner-Tregoe Beslissingsanalyse
- MoSCoW Prioriteringsmatrix
- RACI Rollenverdeling
- Chronologische Tijdlijn
- Customer Journey Pain-Point Map

### Risico
- FMEA Risico-prioritering
- Risico- & Mitigatiematrix
- Kosten-Baten & ROI
- Technology Readiness Level
- Eerdere Afspraken Check

### Inzichten
- Open Vragen & Kennisgaten
- Consensus & Frictie
- Onontdekte Ideeen & Kansen
- Voice of the Customer
- Communicatiedynamiek
- Vervolgvragen
- Keyword Analyse
- Sentiment Analyse

### Content
- FAQ
- Business Case
- McKinsey Executive Summary
- Blog
- E-mail
- Storytelling
- Social Media Post
- PowerPoint / Presentatie JSON

### Educatie
- Leerdocument
- Uitleggen
- Teach Me Onderwerpen (Step 1)
- Teach Me Inhoud (Step 2)
- Show Me Inhoud (TED Talks & Nieuws)

### Tools
- Quiz
- Dashboard


## 2. FAQ
**Beschrijving:** Haalt 10 veelgestelde vragen (en antwoorden) uit het transcript en rangschikt ze op belangrijkheid.
**Extra benodigde velden:** 
- `inputLanguage`
- `outputLanguage`

**Prompt Opbouw:**
```text
From the **[inputLanguage]** transcript below, create 10 FAQ items (question + answer) in **[outputLanguage]**. Rank importance 1–5 stars, allow half-stars (★½). Put the stars before each question. Keep questions short, answers concise and factual. Order from most to least important.

Here is the text:

[TRANSCRIPT]
```

## 3. Leerdocument (Learning)
**Beschrijving:** Genereert een gestructureerd leerdocument met belangrijke takeaways.
**Extra benodigde velden:** 
- `inputLanguage`
- `outputLanguage`

**Prompt Opbouw:**
```text
From the **[inputLanguage]** text below, create a structured learning document in **[outputLanguage]** with: Key takeaways, ranked 1–5 stars (allow half-stars, ★½). Short explanations. Use clear headings and bullet points. Order from most to least important.

Here is the text:

[TRANSCRIPT]
```

## 4. Vervolgvragen (Follow-Up)
**Beschrijving:** Genereert 10 relevante vervolgvragen.
**Extra benodigde velden:** 
- `inputLanguage`
- `outputLanguage`

**Prompt Opbouw:**
```text
Based on the **[inputLanguage]** transcript below, generate 10 relevant follow-up questions in **[outputLanguage]** as a numbered list.

Here is the text:

[TRANSCRIPT]
```

## 5. Keyword Analyse
**Beschrijving:** Identificeert de belangrijkste keywords en groepeert ze in 5-7 relevante onderwerpen.
**Extra benodigde velden:** 
- `inputLanguage`
- `outputLanguage`

**Prompt Opbouw:**
```text
Analyze the following **[inputLanguage]** transcript in **[outputLanguage]**. Identify the most frequent and important keywords. Group these into 5-7 relevant topics. For each topic, provide a short descriptive name and a list of associated keywords. Return JSON only. Transcript: --- [TRANSCRIPT] ---
```

## 6. Sentiment Analyse
**Beschrijving:** Analyseert het algemene sentiment en geeft een JSON output terug.
**Extra benodigde velden:** 
- `inputLanguage`
- `outputLanguage`

**Prompt Opbouw:**
```text
Analyze the sentiment of the following **[inputLanguage]** transcript in **[outputLanguage]**. Return a JSON object with: 1. 'summary': a short factual summary of the sentiments found (e.g., "The conversation was predominantly positive with some negative points about X."). 2. 'conclusion': an overall conclusion about the general tone and atmosphere of the conversation. Do NOT include the full transcript with tags. Transcript: --- [TRANSCRIPT] ---
```

## 7. Social Media Post (LinkedIn/Facebook/Instagram)
**Beschrijving:** Genereert een of meerdere posts voor sociale media, inclusief instructies voor het genereren van een afbeelding.
**Extra benodigde velden:** 
- `platform` (bijv. LinkedIn)
- `toneInstructions` (Specifieke toon beschrijving, bijv. "Gebruik een professionele, zakelijke toon...")
- `platformGuidelines` (Specifieke richtlijnen per platform)
- `targetLength` (Minimum aantal karakters)
- `maxLength` (Maximum aantal karakters)
- `includeHashtags` (boolean: voeg hashtags toe of niet)
- `includeEmoticons` (boolean: voeg emoticons toe of niet)
- `seriesCount` (1 voor een enkele post, of meer voor een thread)

**Prompt Opbouw (Voorbeeld voor enkele post):**
```text
Maak één [platform] bericht in het Nederlands van de volgende tekst.

TOON: [toneInstructions]
PLATFORM RICHTLIJNEN: [platformGuidelines]
LENGTE: Het bericht moet tussen [targetLength] en [maxLength] karakters lang zijn. Streef naar een lengte binnen 5% van [targetLength] karakters en GA NIET onder [Math.floor(targetLength * 0.9)] karakters.

ABSOLUTE VEREISTEN:
- NOOIT beginnen met "Podcast transcriptie", datum informatie of metadata
- Focus ALLEEN op de kerninhoud en belangrijkste inzichten
- Maak het bericht actionable en waardevol voor de lezer
- Gebruik concrete details en voorbeelden uit de tekst
- [Voeg 2-4 relevante hashtags toe aan het einde / Gebruik GEEN hashtags]
- [Gebruik passende emoticons om het bericht levendiger te maken (2-4 emoticons verspreid door de tekst) / Gebruik GEEN emoticons]
- NOOIT landcodes zoals "NL", "DE", "EN" toevoegen
- Geen technische codes, timestamps of metadata
- Vermijd clichés en algemene uitspraken
- Gebruik actieve zinnen en concrete taal
- Begin met een pakkende openingszin
- Eindig met een call-to-action of vraag

KARAKTERTELLING: Tel de karakters en zorg dat het bericht strikt tussen [targetLength]-[maxLength] karakters valt, bij voorkeur binnen 5% van [targetLength]. Als het korter dreigt te worden: voeg concrete details toe (geen fluff) zodat het aan de minimumlengte voldoet.

Tekst: [TRANSCRIPT]
```

## 8. Business Case
**Beschrijving:** Schrijft een overtuigende business case gebaseerd op het transcript, volgens een vaste structuur.
**Extra benodigde velden:** 
- `inputLanguage`
- `outputLanguage`
- `businessCaseTypeDescription` (Beschrijving van het type business case, bijv. Cost savings)
- `safeAudience` (Optioneel: doelgroep)
- `lengthChoice` (concise, extensive, very_extensive)
- `strictLengthInstructionMap` (Vertaalde string met expliciete woordenaantallen per keuze)

**Prompt Opbouw:**
```text
Je bent een ervaren business consultant. Schrijf een overtuigende business case op basis van het transcript.
      
Output taal: [outputLanguage] (schrijf de volledige business case in deze taal).

De business case moet de volgende structuur hebben:

- Titel
- Probleem
- Oplossing  
- Verwachte Impact (kwantitatief en kwalitatief)
- Kosten/Baten analyse
- Conclusie (waarom deze business case waardevol is)

Schrijf helder, zakelijk en overtuigend.

Business Case Type: [businessCaseTypeDescription]
Target Audience / Stakeholders: [safeAudience]
Length: [lengthChoice]
[strictLengthInstructionMap]

Transcript (input taal: [inputLanguage]):
[TRANSCRIPT]
```

## 9. PowerPoint / Presentatie
**Beschrijving:** Genereert een JSON object om een zakelijke presentatie te vullen op basis van het transcript.
**Extra benodigde velden:** 
- `languageCode`
- `maxSlides` (Totaal aantal slides)
- `maxCoreSlides` (Aantal inhoudelijke slides: maxSlides - 7)
- `targetAudience`
- `mainGoal`
- `toneStyle`

**Prompt Opbouw:**
```text
Je bent een AI-expert in het creëren van professionele, gestructureerde en visueel aantrekkelijke zakelijke presentaties op basis van een meeting-transcript. Je taak is om de volgende content te genereren en te structureren in een JSON-object dat voldoet aan het verstrekte schema.

**Taal:** [languageCode] - Alle titels en content moeten in deze taal zijn.

**Maximum aantal slides:** [maxSlides] - Houd de presentatie binnen deze limiet.

**Doelgroep:** [targetAudience] - Pas de presentatie aan voor deze specifieke doelgroep.

**Hoofddoel:** [mainGoal] - Structureer de presentatie om dit doel te bereiken.

**Toon/Stijl:** [toneStyle] - Gebruik deze toon en stijl door de hele presentatie.

[Hier volgen instructies over het verwachte JSON formaat en de velden: titleSlide, agenda, introduction, mainContentSlides, projectStatus, learnings, improvements, todoList, imageStylePrompt]

STRICT LIMITS:
- De totale presentatie mag [maxSlides] slides NIET overschrijden.
- Het aantal mainContentSlides mag NIET groter zijn dan [maxCoreSlides].
- Pas de inhoud (bullet points, titels) zo aan dat de presentatie binnen het limiet blijft.

Transcript:
---
[TRANSCRIPT]
---
```

## 10. McKinsey Executive Summary
**Beschrijving:** Genereert een ultra-korte summary volgens het OSC-R-B-C framework.
**Extra benodigde velden:** 
- `outputLanguage`
- `notExplicitlyDiscussed` (Gelokaliseerde tekst voor "Niet besproken")

**Prompt Opbouw:**
```text
Act as a seasoned McKinsey-style business analyst creating an extremely concise one-slide Executive Summary in OSC-R-B-C format (Objective, Situation, Complication, Resolution, Benefits, Call to Action). Use at most 1-3 short sentences per section. If a section is not explicitly present, output "[notExplicitlyDiscussed]". Write the entire response in [outputLanguage] language. Return ONLY valid JSON with keys: objective, situation, complication, resolution, benefits, call_to_action.

Transcript:
[TRANSCRIPT]
```

## 11. Blog
**Beschrijving:** Genereert een SEO-vriendelijke blog post.
**Extra benodigde velden:** 
- `inputLanguage`
- `outputLanguage`

**Prompt Opbouw:**
```text
Act as an experienced content marketer/blog writer. Analyze the **[inputLanguage]** transcript thoroughly to identify key topics, discussion points, conclusions and insights. Generate a complete blog post in **[outputLanguage]** that effectively communicates the core message of the transcript to a broad audience.
IMPORTANT: Start DIRECTLY with the title (H1), without introduction or explanation about how the blog was written.
Blog Post Structure:
# [Catchy Title] - Start directly with the title
[Directly the first paragraph of the blog, without introduction about what will be covered]
Main sections (H2): Split the main topics from the transcript into 2-4 logical sections, each with a clear heading.
Paragraphs: Each section should consist of multiple paragraphs explaining the content.
Bullets/Bullet Points (if relevant): Use bulleted lists where appropriate to present information more clearly (e.g. key insights, action items, benefits).
Conclusion/Summary: A short conclusion that repeats the main takeaways and encourages the reader to think or take action.
Call to Action (Blog-specific): E.g. "Leave your comment", "Want to know more?", "Subscribe to our newsletter". (Optional, and generic if no specific CTA can be derived from the meeting.)
Tone: The standard tone should be informative, objective and somewhat enthusiastic/engaged. It should captivate the reader.
Length: Standard length: approx. 500 words (or 4000 characters). If the transcript is very short, a shorter but complete blog post. If the transcript is extremely long, focus on the most important highlights within the specified length.

Transcript:
[TRANSCRIPT]
```

## 12. E-mail
**Beschrijving:** Genereert een zakelijke e-mail op basis van de besproken punten in de vergadering.
**Extra benodigde velden:** 
- `inputLanguage`
- `outputLanguage`
- `lengthInstructions` (Kort, Gemiddeld, etc.)
- `toneInstructions` (Professioneel, Informeel, etc.)

**Prompt Opbouw:**
```text
Act as a professional email writer. Analyze the **[inputLanguage]** transcript and create a well-structured email in **[outputLanguage]** based on the specified requirements.

Requirements:
- Length: [lengthInstructions]
- Tone: [toneInstructions]

Structure the email with:
1. Clear subject line
2. Appropriate greeting
3. Main content based on transcript key points
4. Professional closing

IMPORTANT: Start DIRECTLY with the email content, without introduction or explanation about how it was written.

Transcript:
[TRANSCRIPT]
```

## 13. Storytelling
**Beschrijving:** Vormt het transcript om naar een verhalende structuur met emotie en conflict.
**Extra benodigde velden:** 
- `inputLanguage`
- `outputLanguage`
- `customInstructions` (Extra instructies over doelgroep, doel, toon, lengte)

**Prompt Opbouw:**
```text
You receive a **[inputLanguage]** transcript from a meeting/webinar/podcast. Transform this into a narrative text in **[outputLanguage]** that reads like a story. Use storytelling elements: don't use character names, describe the setting, build tension around dilemmas or questions, and end with a clear outcome or cliffhanger. Write in an accessible and vivid style, as if it were a journalistic article or short story. Use quotes from the transcript as dialogue fragments. Focus on emotion, conflict, and the key insights that emerged. Make it readable for a broad audience, without being boring or too technical.[customInstructions]

Transcript:
[TRANSCRIPT]
```

## 14. Uitleggen (Explain)
**Beschrijving:** Legt een concept of focusgebied uit het transcript uit met een bepaald complexiteitsniveau.
**Extra benodigde velden:** 
- `inputLanguage`
- `outputLanguage`
- `complexityLevel` (Beginner, Expert, 5-jarig kind, etc.)
- `focusArea` (Wat er precies uitgelegd moet worden)
- `formatInstructions` (Opsomming, Stap-voor-stap, etc.)

**Prompt Opbouw:**
```text
Act as an expert educator. Analyze the **[inputLanguage]** transcript and create a clear explanation in **[outputLanguage]** based on the specified requirements.

Requirements:
- Complexity Level: [complexityLevel]
- Focus Area: [focusArea]
- Format: [formatInstructions]

IMPORTANT: Start DIRECTLY with the explanation, without introduction or explanation about how it was written.

Transcript:
[TRANSCRIPT]
```

## 15. Educatieve Onderwerpen Genereren (Teach Me / Show Me - Step 1)
**Beschrijving:** Haalt 0-10 mogelijke educatieve onderwerpen uit het transcript.
**Extra benodigde velden:** 
- `inputLanguage`
- `outputLanguage`

**Prompt Opbouw:**
```text
Act as an educational content analyzer. Analyze the **[inputLanguage]** transcript and extract 0-10 educational topics that could be taught based on the content.

Requirements:
- Extract topics that are educational and can be explained to learners
- Each topic should have a clear, descriptive title (max 100 characters)
- Topics should be specific enough to create focused learning content
- Return topics in **[outputLanguage]**
- If no educational topics can be extracted, return an empty array

Format your response as a JSON array of objects with this structure:
[
  {
    "id": "topic1",
    "title": "Topic Title",
    "description": "Brief description of what this topic covers"
  }
]

IMPORTANT: Return ONLY the JSON array, no additional text or formatting.

Transcript:
[TRANSCRIPT]
```

## 16. Teach Me Inhoud (Step 2)
**Beschrijving:** Schrijft educatieve inhoud voor één specifiek geselecteerd onderwerp.
**Extra benodigde velden:** 
- `inputLanguage`
- `outputLanguage`
- `topicTitle` (Titel van gekozen onderwerp)
- `topicDescription` (Omschrijving)
- `methodPrompt` (De gekozen lesmethode prompt, bijv. "Compare [topic] to something familiar...")

**Prompt Opbouw:**
```text
[methodPrompt]

Topic: [topicTitle]
Topic Description: [topicDescription]

Requirements:
- Create educational content in **[outputLanguage]**
- Use your general knowledge about this topic, not just the transcript content
- Make the content engaging and educational
- Structure the content clearly with appropriate formatting
- Aim for comprehensive coverage of the topic

IMPORTANT: Start DIRECTLY with the educational content, without introduction or explanation about how it was written.

Context from transcript:
[TRANSCRIPT]
```

## 17. Show Me Inhoud (TED Talks & Nieuws - Step 2)
**Beschrijving:** Zoekt gerelateerde video's en nieuwsartikelen gebaseerd op het gekozen onderwerp.
**Extra benodigde velden:** 
- `topicTitle`
- `topicDescription`
- `outputLanguage`
- `newsContext` (Land, nieuwsbronnen, search suffixes per taal)

**Prompt Opbouw:**
```text
You are an AI assistant that helps find relevant TED Talks and news articles for educational topics.

Topic: [topicTitle]
Topic Description: [topicDescription]

Requirements:
- Find 3-5 relevant TED Talks and 3-5 relevant news articles
- Use your knowledge to suggest real, existing content
- Provide accurate titles, speakers/authors, and brief descriptions
- Return content in **[outputLanguage]**
- Focus on high-quality, educational content
- Rate each item's relevance from 1-5 stars
- Sort TED Talks by relevance rating (highest to lowest)
- Sort News Articles by relevance rating (highest to lowest)
- For TED Talk URLs: Use YouTube search format: https://www.youtube.com/results?search_query={TITLE}+TED (URL encode the title)
- For News Article URLs: Use Google search format: https://www.google.com/search?q={TITLE}[newsContext.searchSuffix] (URL encode)
- For news articles, prioritize content from [newsContext.sources] when possible
- Focus on news from [newsContext.country] context when relevant to the topic

Format your response as a JSON object with this structure:
{
  "tedTalks": [...],
  "newsArticles": [...]
}

IMPORTANT: Return ONLY the JSON object, no additional text or formatting.

Context from transcript:
[TRANSCRIPT]
```
