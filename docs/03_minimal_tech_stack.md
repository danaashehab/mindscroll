# MindScroll - Minimal Tech Stack Guide

## 1. Why a Minimal Tech Stack?
For a Proof of Concept (PoC) demo, complex frameworks (like React, Next.js, or Node.js backend databases) can add unnecessary complexity.

Using **Vanilla HTML5, CSS3, and JavaScript** allows:
- Zero installation / build step needed.
- Runs directly in any web browser.
- Easy to host for free (e.g. GitHub Pages, Vercel, Netlify, or local browser).
- Simple codebase that anyone can inspect and modify.

---

## 2. File Structure

```
mindscroll-poc/
├── index.html          # Main HTML structure & layout
├── style.css           # Styling, dark mode theme, swipe animations
├── app.js              # Swipe logic, feed manager, AI chat integration
├── data/
│   └── cards.json      # Pre-loaded database of curiosity cards
└── docs/               # Project documentation & task guides
```

---

## 3. Technology Breakdown

| Component | Technology | Purpose |
| :--- | :--- | :--- |
| **Structure** | HTML5 | Clean semantic markup for cards and drawers |
| **Styling** | CSS3 (Variables + Flex/Grid) | Glassmorphism, animations, responsive design |
| **Logic & Swiping** | Vanilla JS (ES6) | Touch swipe handling, UI state, recommendations |
| **Database** | `cards.json` + `localStorage` | Pre-loaded content + browser persistence |
| **AI Tutor** | Fetch API (Gemini REST API) | Direct API calls to AI model for chat replies |

---

## 4. How to Run the Prototype locally

### Option A: VS Code Live Server (Recommended)
1. Open the project folder in VS Code.
2. Install the **Live Server** extension (by Ritwick Dey).
3. Right-click `index.html` and choose **"Open with Live Server"**.

### Option B: Python Built-in Server
Open your terminal inside the project directory and run:
```bash
python -m http.server 8000
```
Then open `http://localhost:8000` in your web browser.

### Option C: Direct File View
Simply double-click `index.html` to open it in Chrome, Edge, or Safari!
*(Note: Fetching `cards.json` requires Option A or B due to browser CORS security for local files).*
