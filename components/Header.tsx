'use client';

import { IconSettings } from './icons';

interface HeaderProps {
  onOpenFavorites: () => void;
  onOpenSettings: () => void;
}

export function Header({ onOpenFavorites, onOpenSettings }: HeaderProps) {
  return (
    <header>
      <div className="logo">
        <div className="logo-icon">💫</div>
        <span>mindscroll</span>
      </div>
      <div className="header-actions">
        <button className="icon-btn" title="View Favorites" onClick={onOpenFavorites}>
          <span style={{ fontSize: '1.1rem' }}>📌</span>
        </button>
        <button className="icon-btn" title="Settings & Customization" onClick={onOpenSettings}>
          <IconSettings />
        </button>
      </div>
    </header>
  );
}
