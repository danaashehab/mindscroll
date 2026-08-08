# Legacy prototype (reference only)

This is the original vanilla HTML/CSS/JS proof-of-concept, kept for reference while
the real app is rebuilt in `app/` (Next.js + Supabase).

Useful things to pull from here while porting:
- `style.css` — the maroon/warm-grey design system (CSS custom properties, card styles)
- `app.js` — swipe handling, recommendation queue logic, AI companion prompt/fallback pattern
- `data/cards.json` — the 16 seed content cards (source of truth for content schema + tone)

Run it standalone with `start.bat` (spins up a local static server on :8000) if you
want to compare behavior against the new app.

Do not add new features here — all active development happens in `app/`.
