# Product Requirements Document (PRD)

# mindscroll
Replace mindless scrolling with curiosity

Version: 4.0

------------------------------------------------------------------------

# Product Vision

Build the world's best curiosity engine.

The platform helps users develop conceptual understanding instead of collecting random facts. Every interaction leaves users feeling that they have learned something meaningful, progressive, and unbiased.

------------------------------------------------------------------------

# Product Philosophy

## Principles

-   Ideas over trivia
-   Understanding over memorization
-   Curiosity over addiction
-   Discovery over algorithmic isolation
-   Lifelong learning over completion

The app should never feel like school and should never feel like social media.

------------------------------------------------------------------------

# Target User

People who enjoy learning, asking questions, and discovering ideas across niche topics, but do not want to read heavy academic textbooks or spend hours searching for verified educational content.

------------------------------------------------------------------------

# User Journey

## First Launch

1.  User enters the app with a quick 3-second visual gesture guide.
2.  The feed immediately loads personalized curiosity cards based on default or configured group topic choices.

## Main Feed

Every card contains:
-   Group: Category Badge (e.g. `The Mind: Neuroscience`)
-   Title
-   Short concept summary
-   📌 Favorite Pushpin button

No comments. No follower counts. No popularity metrics. No distracting bottom gesture bars.

------------------------------------------------------------------------

# Interactions & Navigation

## Vertical Swipe (Up / Down)

Purpose: Discover a non-repeating new idea.

## Right Swipe

Purpose: Level 2 Deep Dive into the SAME idea.

Requirements:
-   Concept breakdown (How it works)
-   Why it matters
-   Real-world examples
-   **Peer-Reviewed / Trusted Source Citations** (NASA, Nature, PubMed, Stanford Enc. Phil, MIT Tech Review)
-   Curated external resources (articles, TED Talks, books, videos)

Must NOT become a feed of related topics.

## Left Swipe

Purpose: Level 3 AI Learning Companion & Standalone Chat.

The AI:
-   Understands the current card context
-   Answers follow-up questions in an engaging, unbiased manner
-   Supports Standalone AI Chats created directly from Settings for non-card queries

------------------------------------------------------------------------

# 4 Groups / 14 Categories Taxonomy

MindScroll content is organized into 4 main Groups and 14 Categories:

### 1st Group: The World
1.  **Business & Economics**: Money, entrepreneurship, markets, strategy, consumer behavior, investments, innovation, leadership, productivity.
2.  **Mythology**: Greek, Norse, Roman, Egyptian, and world mythologies.
3.  **Islam & Wisdom**: Quran verses, Hadith, history, reflection, daily habits *(Note: Strictly excluded from feeds UNLESS explicitly checked in topic settings)*.
4.  **History, Society & Anthropology**: Unbiased politics, ancient civilizations, archaeology, cultures, social structure.

### 2nd Group: The Mind
5.  **Psychology**: Human behavior, personality, social psychology, reading a room, relationships (non-romantic), decision making, self-improvement.
6.  **Neuroscience**: Brain regions, learning, memory, emotions, consciousness, disorders.
7.  **Philosophy & Thinking**: Human nature, ethics, logic, mental models, critical thinking, cognitive biases, problem solving, system thinking, thought experiments.

### 3rd Group: Science
8.  **Astronomy**: Space, celestial objects, mysteries & theories, universe structure.
9.  **Physics**: Motion, energy, matter, quantum physics, relativity.
10. **Health & Biology**: Human body (clean facts), nutrition, fitness, disease, genetics, evolution, microbiology.
11. **Technology**: Computing, AI, engineering, future technology, ethics, coding.

### 4th Group: Curiosity
12. **Mysteries**: Ancient mysteries, scientific mysteries, unsolved questions, famous theories.
13. **Creativity**: Art, music, literature, design, architecture.
14. **Random Facts**: Standalone fascinating facts across disciplines.

------------------------------------------------------------------------

# Recommendation Engine & Non-Repeating Progression

## Inputs

-   Topic Checklists (70% Personalized Baseline)
-   Topic Engagement Scores (increased via Favoriting 📌, Chatting 💬, or Deep Diving 📖)
-   Non-repeating queue tracking (`seenCardIds`)

## Progression

-   As topic engagement grows, cards advance seamlessly into **Level 3 Unbiased Theories, Unsolved Questions, and Recent Discoveries**.
-   The feed never loops or stops.

## Distribution

-   **70% Personalized**: Drawn from checked categories in the 4 Groups.
-   **30% Discovery**: Drawn from unchecked categories to prevent narrow filter bubbles.
-   **Islam Exception**: Islam cards are strictly excluded from both pools UNLESS explicitly checked.

------------------------------------------------------------------------

# Settings Hierarchy (3-Button Master Menu)

1.  **👤 Account Details**: Display Name, Email, Password management.
2.  **💬 AI Chat History**: View past chat sessions + **`➕ Start Standalone AI Chat`** button.
3.  **🎯 Topic Selection**: Navigate through the 4 Group cards to check/uncheck categories.

------------------------------------------------------------------------

# Design System & Aesthetics

-   Background: Warm medium-grey (`#e4e1dc`).
-   Accents: Rich Maroon (`#7a1c2d` / `#962338`).
-   Cards: Crisp white (`#ffffff`) with subtle maroon-tinted borders and soft shadows.
-   Logo: Maroon Shooting Star badge (💫) + `mindscroll` title.
