'use client';

import { useEffect, useRef } from 'react';
import { useMindScroll, type MindScrollApi } from '@/hooks/useMindScroll';
import { Header } from './Header';
import { CardViewport } from './CardViewport';
import { FavoritesDrawer } from './FavoritesDrawer';
import { DeepDiveDrawer } from './DeepDiveDrawer';
import { AiChatDrawer } from './AiChatDrawer';
import { OnboardingModal } from './OnboardingModal';
import { SettingsModal } from './SettingsModal';

export function AppShell() {
  const app = useMindScroll();

  // Keep a live ref to the latest app functions so the (mount-once) keydown
  // listener never calls stale closures from an earlier render — several of
  // these callbacks (e.g. openDeepDiveDrawer) change identity as currentCard
  // changes.
  const appRef = useRef<MindScrollApi>(app);
  appRef.current = app;

  useEffect(() => {
    function handleKeydown(e: KeyboardEvent) {
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT') return;

      const current = appRef.current;
      if (e.key === 'ArrowDown') current.nextCard();
      else if (e.key === 'ArrowUp') current.prevCard();
      else if (e.key === 'ArrowRight') current.openDeepDiveDrawer();
      else if (e.key === 'ArrowLeft') current.openAiDrawer();
      else if (e.key === 'Escape') {
        current.closeDrawers();
        current.closeModals();
      }
    }
    document.addEventListener('keydown', handleKeydown);
    return () => document.removeEventListener('keydown', handleKeydown);
  }, []);

  if (!app.hydrated) {
    return (
      <div className="ambient-glow">
        <div className="orb orb-1" />
        <div className="orb orb-2" />
      </div>
    );
  }

  return (
    <>
      <div className="ambient-glow">
        <div className="orb orb-1" />
        <div className="orb orb-2" />
      </div>

      <Header onOpenFavorites={app.openFavoritesDrawer} onOpenSettings={() => app.setSettingsOpen(true)} />

      <CardViewport
        card={app.currentCard}
        isFavorited={!!app.currentCard && app.favoritedCardIds.has(app.currentCard.id)}
        onNext={app.nextCard}
        onPrev={app.prevCard}
        onDeepDive={app.openDeepDiveDrawer}
        onAskAi={() => app.openAiDrawer()}
        onToggleFavorite={app.toggleFavorite}
      />

      <FavoritesDrawer
        open={app.openDrawer === 'favorites'}
        cards={app.cards}
        favoritedCardIds={app.favoritedCardIds}
        onClose={app.closeDrawers}
        onSelectCard={app.jumpToCard}
      />

      <AiChatDrawer
        open={app.openDrawer === 'ai'}
        card={app.drawerCard}
        chatThreads={app.chatThreads}
        activeThreadKey={app.activeThreadKey}
        isSending={app.isSending}
        onClose={app.closeDrawers}
        onSend={app.sendChat}
      />

      <DeepDiveDrawer open={app.openDrawer === 'deepDive'} card={app.drawerCard} onClose={app.closeDrawers} />

      <OnboardingModal open={app.onboardingOpen} onClose={app.dismissOnboarding} />

      <SettingsModal
        open={app.settingsOpen}
        selectedCategories={app.selectedCategories}
        chatThreads={app.chatThreads}
        onClose={() => app.setSettingsOpen(false)}
        onSaveTopics={app.saveTopicPreferences}
        onContinueThread={(key) => app.openAiDrawer(key)}
      />
    </>
  );
}
