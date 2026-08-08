'use client';

import type { Card } from '@/lib/types';
import { IconClose, IconExternalLink } from './icons';

interface DeepDiveDrawerProps {
  open: boolean;
  card: Card | undefined;
  onClose: () => void;
}

export function DeepDiveDrawer({ open, card, onClose }: DeepDiveDrawerProps) {
  const level2 = card?.level2;

  return (
    <aside className={`drawer drawer-right ${open ? 'open' : ''}`}>
      <div className="drawer-header">
        <div className="drawer-title">
          <span>📖</span> Deep Dive
        </div>
        <button className="icon-btn" onClick={onClose}>
          <IconClose />
        </button>
      </div>
      <div className="drawer-body">
        {card && level2 && (
          <>
            <div className="deep-dive-section">
              <div className="section-label">Concept Breakdown</div>
              <h2 style={{ fontFamily: 'var(--font-outfit)', fontSize: '1.3rem', color: 'var(--accent-maroon-dark)', marginBottom: 12 }}>
                {card.title}
              </h2>
              <p className="section-content">{level2.howItWorks}</p>
            </div>

            <div className="deep-dive-section">
              <div className="section-label">Why It Matters</div>
              <p className="section-content">{level2.whyItMatters}</p>
            </div>

            <div className="deep-dive-section">
              <div className="section-label">Real-World Application</div>
              <p className="section-content">{level2.example}</p>
            </div>

            {level2.sourceReference && (
              <div className="source-citation-badge">
                <div>
                  <div className="citation-title">Peer-Reviewed / Trusted Source</div>
                  <div className="citation-name">{level2.sourceReference.name}</div>
                </div>
                <a href={level2.sourceReference.url} target="_blank" rel="noopener noreferrer" className="citation-link">
                  Verify ↗
                </a>
              </div>
            )}

            <div className="deep-dive-section" style={{ marginTop: 10 }}>
              <div className="section-label">Curated External Resources</div>
              {level2.resources.map((res, i) => (
                <a href={res.url} target="_blank" rel="noopener noreferrer" className="resource-card" key={i}>
                  <div>
                    <div className="resource-type">{res.type}</div>
                    <div className="resource-title">{res.title}</div>
                  </div>
                  <IconExternalLink />
                </a>
              ))}
            </div>
          </>
        )}
      </div>
    </aside>
  );
}
