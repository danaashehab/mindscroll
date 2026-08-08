'use client';

import { useRef } from 'react';
import type { Card } from '@/lib/types';
import { IconChevronUp, IconChevronDown, IconChevronLeft, IconChevronRight } from './icons';

interface CardViewportProps {
  card: Card | undefined;
  isFavorited: boolean;
  onNext: () => void;
  onPrev: () => void;
  onDeepDive: () => void;
  onAskAi: () => void;
  onToggleFavorite: () => void;
}

const SWIPE_THRESHOLD = 45;

export function CardViewport({ card, isFavorited, onNext, onPrev, onDeepDive, onAskAi, onToggleFavorite }: CardViewportProps) {
  const touchStart = useRef({ x: 0, y: 0 });

  function handleTouchStart(e: React.TouchEvent) {
    touchStart.current = { x: e.changedTouches[0].screenX, y: e.changedTouches[0].screenY };
  }

  function handleTouchEnd(e: React.TouchEvent) {
    const endX = e.changedTouches[0].screenX;
    const endY = e.changedTouches[0].screenY;
    const deltaX = endX - touchStart.current.x;
    const deltaY = endY - touchStart.current.y;

    if (Math.abs(deltaY) > Math.abs(deltaX)) {
      if (deltaY < -SWIPE_THRESHOLD) onNext();
      else if (deltaY > SWIPE_THRESHOLD) onPrev();
    } else {
      if (deltaX > SWIPE_THRESHOLD) onDeepDive();
      else if (deltaX < -SWIPE_THRESHOLD) onAskAi();
    }
  }

  return (
    <>
      <main id="app-container">
        <div className="card-viewport">
          {card && (
            <div
              className="curiosity-card"
              key={card.id}
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
            >
              <div className="card-header">
                <span className="category-badge">
                  {card.group}: {card.category}
                </span>
              </div>

              <div className="card-body">
                <h1 className="card-title">{card.title}</h1>
                <p className="card-summary">{card.level1.summary}</p>
              </div>

              <div className="card-footer">
                <span className="card-level-tag">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="16" />
                  </svg>
                  Level {card.levelNum || 1} {card.levelNum === 3 ? '(Theories)' : ''}
                </span>
                <button className={`fav-btn ${isFavorited ? 'favorited' : ''}`} onClick={onToggleFavorite}>
                  <span>📌</span>
                  <span>{isFavorited ? 'Favorited' : 'Favorite'}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      <div className="desktop-controls">
        <button className="icon-btn" title="Previous Card (Up Arrow)" onClick={onPrev}>
          <IconChevronUp />
        </button>
        <button className="icon-btn" title="Ask AI Tutor (Left Arrow)" onClick={onAskAi}>
          <IconChevronLeft />
        </button>
        <button className="icon-btn" title="Deep Dive (Right Arrow)" onClick={onDeepDive}>
          <IconChevronRight />
        </button>
        <button className="icon-btn" title="Next Card (Down Arrow)" onClick={onNext}>
          <IconChevronDown />
        </button>
      </div>
    </>
  );
}
