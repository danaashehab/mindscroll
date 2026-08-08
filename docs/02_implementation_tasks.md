# MindScroll - Proof of Concept Implementation Tasks v4

This document contains the complete checklist of tasks implemented for the MindScroll PoC demo.

---

## Phase 1: Setup & Data Foundation
- [x] **Task 1.1: Project Directory Structure**
  - Project files: `index.html`, `style.css`, `app.js`, and `data/cards.json`.
- [x] **Task 1.2: Populate Content Dataset (`data/cards.json`)**
  - Populate 14 categories across 4 Groups (*The World*, *The Mind*, *Science*, *Curiosity*).
  - Include Level 1, Level 2, and Level 3 (Theories & Discoveries) cards with peer-reviewed source references.

---

## Phase 2: Core Feed & Card UI (Level 1)
- [x] **Task 2.1: Card Layout & Theme (#e4e1dc)**
  - Build crisp white card container styled with `#e4e1dc` warm grey background, Maroon (`#7a1c2d`) titles/accents, `Group: Category` badge, and clean card body (bottom gesture bar removed).
- [x] **Task 2.2: Vertical Navigation (Swipe Up/Down & Key Controls)**
  - Implement touch events (`touchstart`, `touchend`) for mobile swipe up/down.
  - Add keyboard arrow key fallback (`ArrowUp`, `ArrowDown`) and desktop floating buttons.
- [x] **Task 2.3: Favorites System (Pushpin 📌)**
  - Implement Pushpin Favorite button handling.
  - Save favorited card IDs to `localStorage`.
  - Build slide-in Favorites Drawer (`#favorites-drawer`) listing all pinned cards with click-to-jump navigation.

---

## Phase 3: Deep Dive Panel (Level 2 - Right Swipe)
- [x] **Task 3.1: Right Swipe Gesture & Drawer Trigger**
  - Detect swipe right on current card or click on `ArrowRight` key / desktop button.
  - Open Deep Dive drawer displaying concept breakdown, why it matters, real-world examples.
- [x] **Task 3.2: Peer-Reviewed / Trusted Source Citations**
  - Render source reference citations (NASA, Nature, PubMed, Stanford Enc. Phil, MIT Tech Review).

---

## Phase 4: AI Learning Companion (Level 3 - Left Swipe & Standalone Chat)
- [x] **Task 4.1: Left Swipe Gesture & Context Chat**
  - Detect swipe left on current card or `ArrowLeft` key to open AI chat pre-loaded with current card context.
- [x] **Task 4.2: Standalone AI Chat Feature**
  - Allow launching new standalone AI chats from Settings → AI History to discuss non-card curiosities.
- [x] **Task 4.3: Gemini API Integration & Offline Fallback**
  - Connect to Google Gemini API with system prompt context and smart offline fallback responses.

---

## Phase 5: Recommendation Engine (70/30 Rule & Non-Repeating Progression)
- [x] **Task 5.1: 4 Groups / 14 Categories Taxonomy**
  - Organize feed preferences into 4 Groups (*The World*, *The Mind*, *Science*, *Curiosity*).
- [x] **Task 5.2: Islam Exception Rule**
  - Strictly exclude Islam cards unless explicitly checked under "The World" group checklist.
- [x] **Task 5.3: Non-Repeating Card Queue & Level Progression**
  - Track `seenCardIds` so cards never loop or repeat.
  - Increase topic engagement score on user interactions to unlock Level 3 Theories & Discoveries cards.

---

## Phase 6: 3-Button Settings Hierarchy
- [x] **Task 6.1: Master Settings Menu (3 Buttons)**
  - Build master view with 3 main buttons: `👤 Account Details`, `💬 AI Chat History`, and `🎯 Topic Selection`.
- [x] **Task 6.2: Settings Sub-views**
  - Build sub-pages for Account inputs, AI History list + Standalone chat button, and 4-Group topic selector cards.
