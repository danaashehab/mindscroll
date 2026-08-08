'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { CARDS } from '@/lib/cards';
import { DEFAULT_SELECTED_CATEGORIES } from '@/lib/taxonomy';
import type { Card, ChatThreads, EngagementScores } from '@/lib/types';

type Direction = 'none' | 'up' | 'down';
type DrawerName = 'favorites' | 'deepDive' | 'ai' | null;

const STORAGE_KEYS = {
  favorites: 'mindscroll_favorites',
  seen: 'mindscroll_seen',
  engagement: 'mindscroll_engagement',
  threads: 'mindscroll_ai_threads',
  categories: 'mindscroll_categories',
  onboarding: 'mindscroll_onboarding_v5',
} as const;

function readJson<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function buildQueue(
  seenCardIds: Set<string>,
  selectedCategories: Set<string>,
  engagement: EngagementScores
): { queue: Card[]; nextSeen: Set<string> } {
  const isIslamChecked = selectedCategories.has('Islam & Wisdom');
  const eligible = CARDS.filter((c) => (c.category === 'Islam & Wisdom' ? isIslamChecked : true));

  let unvisited = eligible.filter((c) => !seenCardIds.has(c.id));
  let nextSeen = seenCardIds;
  if (unvisited.length === 0) {
    nextSeen = new Set();
    unvisited = eligible;
  }

  const sorted = [...unvisited].sort((a, b) => {
    const scoreA = engagement[a.category] || 0;
    const scoreB = engagement[b.category] || 0;
    return (scoreB * 10 + b.levelNum) - (scoreA * 10 + a.levelNum);
  });

  return { queue: sorted, nextSeen };
}

function generateSmartMockResponse(question: string): string {
  const qLower = question.toLowerCase();
  if (qLower.includes('analogy')) {
    return "Think of this concept like an architect's blueprint: every structural choice dictates how the overall framework functions under load.";
  }
  return 'Great question! The core mechanism relies on progressive adaptation—strengthening understanding step-by-step through focused curiosity.';
}

export function useMindScroll() {
  const [hydrated, setHydrated] = useState(false);

  const [queue, setQueue] = useState<Card[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState<Direction>('none');

  const [favoritedCardIds, setFavoritedCardIds] = useState<Set<string>>(new Set());
  const [seenCardIds, setSeenCardIds] = useState<Set<string>>(new Set());
  const [engagement, setEngagement] = useState<EngagementScores>({});
  const [selectedCategories, setSelectedCategories] = useState<Set<string>>(
    new Set(DEFAULT_SELECTED_CATEGORIES)
  );

  const [chatThreads, setChatThreads] = useState<ChatThreads>({});
  const [activeThreadKey, setActiveThreadKey] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);

  // The card a drawer (deep dive / AI chat) is showing, pinned at the moment
  // the drawer opens. Deliberately NOT derived from currentCard: opening a
  // drawer boosts engagement, which reorders the queue and can move
  // currentCard out from under the open drawer.
  const [drawerCard, setDrawerCard] = useState<Card | undefined>(undefined);

  const [openDrawer, setOpenDrawer] = useState<DrawerName>(null);
  const [onboardingOpen, setOnboardingOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  // Refs mirror latest state for use inside stable callbacks without re-subscribing.
  const seenRef = useRef(seenCardIds);
  seenRef.current = seenCardIds;
  const engagementRef = useRef(engagement);
  engagementRef.current = engagement;
  const categoriesRef = useRef(selectedCategories);
  categoriesRef.current = selectedCategories;
  const queueRef = useRef(queue);
  queueRef.current = queue;

  // Hydrate from localStorage on mount (client only, avoids SSR mismatch).
  useEffect(() => {
    const favorites = new Set(readJson<string[]>(STORAGE_KEYS.favorites, []));
    const seen = new Set(readJson<string[]>(STORAGE_KEYS.seen, []));
    const eng = readJson<EngagementScores>(STORAGE_KEYS.engagement, {});
    const threads = readJson<ChatThreads>(STORAGE_KEYS.threads, {});
    const categories = new Set(readJson<string[]>(STORAGE_KEYS.categories, DEFAULT_SELECTED_CATEGORIES));

    setFavoritedCardIds(favorites);
    setSeenCardIds(seen);
    setEngagement(eng);
    setChatThreads(threads);
    setSelectedCategories(categories);

    const { queue: initialQueue, nextSeen } = buildQueue(seen, categories, eng);
    setQueue(initialQueue);
    setCurrentIndex(0);
    setSeenCardIds(nextSeen);

    if (!window.localStorage.getItem(STORAGE_KEYS.onboarding)) {
      setOnboardingOpen(true);
    }

    setHydrated(true);
  }, []);

  // Mark the current card seen once the queue/index settle.
  useEffect(() => {
    if (!hydrated || queue.length === 0) return;
    const card = queue[currentIndex];
    if (!card) return;
    setSeenCardIds((prev) => {
      if (prev.has(card.id)) return prev;
      const next = new Set(prev);
      next.add(card.id);
      window.localStorage.setItem(STORAGE_KEYS.seen, JSON.stringify([...next]));
      return next;
    });
  }, [hydrated, queue, currentIndex]);

  const rebuildQueue = useCallback(() => {
    const { queue: nextQueue, nextSeen } = buildQueue(
      seenRef.current,
      categoriesRef.current,
      engagementRef.current
    );
    setQueue(nextQueue);
    setCurrentIndex(0);
    setSeenCardIds(nextSeen);
  }, []);

  const boostTopicEngagement = useCallback(
    (category: string) => {
      setEngagement((prev) => {
        const next = { ...prev, [category]: (prev[category] || 0) + 1 };
        window.localStorage.setItem(STORAGE_KEYS.engagement, JSON.stringify(next));
        engagementRef.current = next;
        return next;
      });
    },
    []
  );

  // Rebuild the queue right after an engagement boost lands (mirrors app.js's
  // immediate re-sort so higher-engagement topics surface deeper cards next).
  useEffect(() => {
    if (!hydrated) return;
    rebuildQueue();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [engagement]);

  const closeDrawers = useCallback(() => setOpenDrawer(null), []);
  const closeModals = useCallback(() => {
    setOnboardingOpen(false);
    setSettingsOpen(false);
  }, []);

  const nextCard = useCallback(() => {
    setOpenDrawer(null);
    const len = queueRef.current.length;
    if (len === 0) return;
    setCurrentIndex((i) => (i + 1) % len);
    setDirection('up');
  }, []);

  const prevCard = useCallback(() => {
    setOpenDrawer(null);
    const len = queueRef.current.length;
    if (len === 0) return;
    setCurrentIndex((i) => (i - 1 + len) % len);
    setDirection('down');
  }, []);

  const jumpToCard = useCallback((cardId: string) => {
    const idx = queueRef.current.findIndex((c) => c.id === cardId);
    if (idx !== -1) setCurrentIndex(idx);
    setOpenDrawer(null);
  }, []);

  const currentCard: Card | undefined = queue[currentIndex];

  const toggleFavorite = useCallback(() => {
    if (!currentCard) return;
    const card = currentCard;
    setFavoritedCardIds((prev) => {
      const next = new Set(prev);
      if (next.has(card.id)) {
        next.delete(card.id);
      } else {
        next.add(card.id);
        boostTopicEngagement(card.category);
      }
      window.localStorage.setItem(STORAGE_KEYS.favorites, JSON.stringify([...next]));
      return next;
    });
  }, [currentCard, boostTopicEngagement]);

  const openFavoritesDrawer = useCallback(() => setOpenDrawer('favorites'), []);

  const openDeepDiveDrawer = useCallback(() => {
    if (!currentCard) return;
    setDrawerCard(currentCard);
    boostTopicEngagement(currentCard.category);
    setOpenDrawer('deepDive');
  }, [currentCard, boostTopicEngagement]);

  const persistThreads = useCallback((threads: ChatThreads) => {
    window.localStorage.setItem(STORAGE_KEYS.threads, JSON.stringify(threads));
  }, []);

  const openAiDrawer = useCallback(
    (overrideCardId?: string) => {
      const cardId = overrideCardId || currentCard?.id;
      if (!cardId) return;
      // Look up by id rather than assuming currentCard: overrideCardId (from
      // "continue a past thread") can point at a card that isn't the one
      // currently on screen.
      const card = CARDS.find((c) => c.id === cardId);
      const cardTitle = card ? card.title : 'Card Conversation';

      setActiveThreadKey(cardId);
      setDrawerCard(card);
      if (card) boostTopicEngagement(card.category);

      setChatThreads((prev) => {
        if (prev[cardId]) return prev;
        const next: ChatThreads = {
          ...prev,
          [cardId]: {
            title: cardTitle,
            cardId,
            messages: [
              { role: 'ai', text: `Hello! I'm your **MindScroll AI Tutor**. Ask me anything about **${cardTitle}**!` },
            ],
          },
        };
        persistThreads(next);
        return next;
      });

      setOpenDrawer('ai');
    },
    [currentCard, boostTopicEngagement, persistThreads]
  );

  const sendChat = useCallback(
    async (rawQuestion: string) => {
      const question = rawQuestion.trim();
      if (!question || !activeThreadKey) return;

      setChatThreads((prev) => {
        const thread = prev[activeThreadKey];
        if (!thread) return prev;
        const next = {
          ...prev,
          [activeThreadKey]: { ...thread, messages: [...thread.messages, { role: 'user' as const, text: question }] },
        };
        persistThreads(next);
        return next;
      });

      setIsSending(true);
      // AI replies are generated client-side for now (no server-side Gemini
      // proxy yet — that lands Day 6). Never call the LLM directly from the
      // browser with a raw API key; see Production Readiness Report.
      await new Promise((resolve) => setTimeout(resolve, 500));
      const responseText = generateSmartMockResponse(question);

      setChatThreads((prev) => {
        const thread = prev[activeThreadKey];
        if (!thread) return prev;
        const next = {
          ...prev,
          [activeThreadKey]: { ...thread, messages: [...thread.messages, { role: 'ai' as const, text: responseText }] },
        };
        persistThreads(next);
        return next;
      });
      setIsSending(false);
    },
    [activeThreadKey, persistThreads]
  );

  const saveTopicPreferences = useCallback(
    (categories: Set<string>) => {
      setSelectedCategories(categories);
      categoriesRef.current = categories;
      window.localStorage.setItem(STORAGE_KEYS.categories, JSON.stringify([...categories]));
      rebuildQueue();
    },
    [rebuildQueue]
  );

  const dismissOnboarding = useCallback(() => {
    window.localStorage.setItem(STORAGE_KEYS.onboarding, 'true');
    setOnboardingOpen(false);
  }, []);

  return {
    hydrated,
    cards: CARDS,
    queue,
    currentCard,
    drawerCard,
    direction,
    favoritedCardIds,
    engagement,
    selectedCategories,
    chatThreads,
    activeThreadKey,
    isSending,
    openDrawer,
    onboardingOpen,
    settingsOpen,
    setSettingsOpen,
    nextCard,
    prevCard,
    jumpToCard,
    toggleFavorite,
    openFavoritesDrawer,
    openDeepDiveDrawer,
    openAiDrawer,
    sendChat,
    saveTopicPreferences,
    dismissOnboarding,
    closeDrawers,
    closeModals,
  };
}

export type MindScrollApi = ReturnType<typeof useMindScroll>;
