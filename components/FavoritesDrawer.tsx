'use client';

import type { Card } from '@/lib/types';
import { IconClose } from './icons';

interface FavoritesDrawerProps {
  open: boolean;
  cards: Card[];
  favoritedCardIds: Set<string>;
  onClose: () => void;
  onSelectCard: (cardId: string) => void;
}

export function FavoritesDrawer({ open, cards, favoritedCardIds, onClose, onSelectCard }: FavoritesDrawerProps) {
  const favCards = cards.filter((c) => favoritedCardIds.has(c.id));

  return (
    <aside className={`drawer drawer-right ${open ? 'open' : ''}`}>
      <div className="drawer-header">
        <div className="drawer-title">
          <span>📌</span> Favorited Ideas
        </div>
        <button className="icon-btn" onClick={onClose}>
          <IconClose />
        </button>
      </div>
      <div className="drawer-body">
        {favCards.length === 0 ? (
          <div className="empty-state">
            No favorited ideas yet. Click the 📌 Favorite button on any card to save it here!
          </div>
        ) : (
          favCards.map((c) => (
            <div className="fav-item-card" key={c.id} onClick={() => onSelectCard(c.id)}>
              <div>
                <div className="fav-item-cat">
                  {c.group}: {c.category}
                </div>
                <div className="fav-item-title">{c.title}</div>
              </div>
              <span style={{ fontSize: '1.2rem' }}>📌</span>
            </div>
          ))
        )}
      </div>
    </aside>
  );
}
