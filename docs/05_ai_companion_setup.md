# MindScroll - AI Companion & Standalone Chat Setup Guide v4

The AI Companion (Level 3 - Left Swipe) provides interactive tutoring for active cards AND supports standalone curiosity chats started from Settings.

---

## 1. Dual Operating Modes

1. **Card-Context Chat Mode (Left Swipe / `ArrowLeft`)**:
   - Extracts current card's `title`, `group`, `category`, and `summary`.
   - Opens AI Drawer displaying active card context header: *"Active Context: [Title] ([Group]: [Category])"*.
   - Answers questions strictly anchored around the active card concept.

2. **Standalone Curiosity Chat Mode (Settings → AI History → `➕ Start Standalone AI Chat`)**:
   - Opens AI Drawer in standalone mode: *"Standalone Curiosity Chat"*.
   - Allows users to ask any random question or explore niche thoughts not tied to any feed card.

---

## 2. AI System Prompt Template

```text
You are MindScroll AI, an engaging, patient, and unbiased curiosity tutor.
The user is currently asking about:
- Title: {{card.title}}
- Taxonomy: {{card.group}} -> {{card.category}}
- Summary: {{card.level1.summary}}

Rules:
1. Answer clearly, concisely, and conversationally without textbook jargon or bias.
2. Keep responses under 120 words to maintain a clean reading flow.
3. For Level 3 Theories & Frontier Discoveries, present balanced perspectives encouraging critical thinking.
```

---

## 3. Gemini API Client Integration (JavaScript)

```javascript
async function askAICompanion(userQuestion, cardContext, apiKey) {
  if (!apiKey) {
    return generateSmartMockResponse(userQuestion, cardContext);
  }

  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

  const promptText = `
System Context: You are MindScroll AI tutor. Context: ${cardContext ? cardContext.title : 'Standalone Curiosity Chat'}.
User Question: ${userQuestion}
  `;

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contents: [{ parts: [{ text: promptText }] }] })
    });
    const data = await response.json();
    return data.candidates[0].content.parts[0].text;
  } catch (error) {
    console.error("AI Fetch Error:", error);
    return generateSmartMockResponse(userQuestion, cardContext);
  }
}

function generateSmartMockResponse(question, card) {
  const qLower = question.toLowerCase();
  if (qLower.includes('analogy')) {
    return `Think of **${card.title}** like an architect's blueprint: every structural choice impacts how the whole building functions.`;
  }
  return `Great question regarding **${card.title}**! The fundamental mechanism shows that ${card.level2.howItWorks}`;
}
```
