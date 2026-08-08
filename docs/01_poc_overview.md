# MindScroll - Proof of Concept (PoC) Overview v4

## 1. Project Goal
The goal of this Proof of Concept (PoC) is to build an interactive, working mini-prototype of **MindScroll** to demonstrate the core value proposition:
Replacing mindless vertical scrolling with meaningful, progressive learning through a 3-way swipe interface.

---

## 2. Scope of the PoC
For the PoC/Demo, we focus strictly on the essential features that prove the user experience and core value:

### Included in PoC:
1. **Vertical Feed (Up / Down)**:
   - Smooth card transitions (mobile-friendly swipe gestures + desktop keyboard arrow navigation).
   - Card content: `Group: Category` badge, title, concise explanation (Level 1 Curiosity Card), Pushpin Favorite button (`📌`).
   - Clean card body without distracting bottom gesture bars.
2. **Right Panel (Right Swipe / Right Arrow)**:
   - Deep Dive modal/drawer into the *same concept* (Level 2).
   - "How it works", "Why it matters", real-world examples, **Peer-Reviewed / Trusted Source Citations** (NASA, Nature, PubMed, Stanford Enc. Phil), and links to curated videos/books/articles.
3. **Left Panel (Left Swipe / Left Arrow)**:
   - AI Companion chat drawer (Level 3).
   - Context-aware tutoring connected to Gemini API (with smart offline fallback) that understands the card currently on screen.
4. **Favorites Drawer (`📌`)**:
   - Slide-in side drawer listing all pinned/favorited cards with quick links to jump directly to any card.
5. **Non-Repeating Cards & Topic Progression Engine**:
   - Cards do **not repeat** or loop.
   - Interacting with a topic (📌 Favoriting, 💬 Chatting with AI, 📖 Opening Deep Dive) increases topic engagement level, unlocking higher-level cards (Level 1 Curiosity → Level 2 Deep Dive → Level 3 Unbiased Theories & Recent Discoveries).
6. **70/30 Recommendation Engine & 14-Category Taxonomy**:
   - 14 categories organized across 4 main Groups:
     - **The World**: Business & Economics, Mythology, Islam & Wisdom (Exception Rule), History, Society & Anthropology.
     - **The Mind**: Psychology, Neuroscience, Philosophy & Thinking.
     - **Science**: Astronomy, Physics, Health & Biology, Technology.
     - **Curiosity**: Mysteries, Creativity, Random Facts.
   - **Islam Exception Rule**: Islam category cards are strictly excluded from both pools UNLESS explicitly checked under "The World" settings.
7. **3-Button Settings Hierarchy & Standalone AI Chat**:
   - Clean master menu leading to 3 sub-pages:
     - **Button 1: 👤 Account Details** (Name, Email, Password).
     - **Button 2: 💬 AI Chat History** (Past chats + **`➕ Start Standalone AI Chat`** button).
     - **Button 3: 🎯 Topic Selection** (4 Group cards → Category Checkbox Grid for 70/30 feed baseline).
8. **Clean & Modern UI Aesthetic**:
   - Warm medium-grey background (`#e4e1dc`), crisp white cards (`#ffffff`), and rich Maroon accents (`#7a1c2d` / `#962338`).
   - Maroon Shooting Star brand logo badge (💫).

---

## 3. Recommended Minimal Tech Stack
- **Frontend**: Single-Page Web Application using HTML5, Vanilla CSS, and Vanilla JavaScript (ES6). No build tools required.
- **Data Storage**: Simple `cards.json` file for content + browser `localStorage` for user preferences, favorites, engagement scores, and chat history.
- **AI Integration**: Simple direct fetch calls to the Google Gemini API using a client-side API key or smart offline mock fallback.
- **Local Dev Server**: Python built-in server (`python -m http.server`) or direct file viewing in any modern browser.
