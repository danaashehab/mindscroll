'use client';

import { useState } from 'react';
import type { ChatThreads } from '@/lib/types';
import { GROUP_TAXONOMY, GROUP_ICONS } from '@/lib/taxonomy';

type View = 'master' | 'account' | 'ai-history' | 'topics';

interface SettingsModalProps {
  open: boolean;
  selectedCategories: Set<string>;
  chatThreads: ChatThreads;
  onClose: () => void;
  onSaveTopics: (categories: Set<string>) => void;
  onContinueThread: (threadKey: string) => void;
}

export function SettingsModal({ open, selectedCategories, chatThreads, onClose, onSaveTopics, onContinueThread }: SettingsModalProps) {
  const [view, setView] = useState<View>('master');
  const [activeGroup, setActiveGroup] = useState('The World');
  const [draftCategories, setDraftCategories] = useState<Set<string>>(selectedCategories);

  function openView(next: View) {
    if (next === 'topics') setDraftCategories(new Set(selectedCategories));
    setView(next);
  }

  function toggleCategory(cat: string) {
    setDraftCategories((prev) => {
      const next = new Set(prev);
      if (next.has(cat)) next.delete(cat);
      else next.add(cat);
      return next;
    });
  }

  function saveAndClose() {
    onSaveTopics(draftCategories);
    setView('master');
    onClose();
  }

  const threadKeys = Object.keys(chatThreads);

  return (
    <div
      className={`modal-overlay ${open ? 'active' : ''}`}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          setView('master');
          onClose();
        }
      }}
    >
      <div className="modal-card">
        {view === 'master' && (
          <div>
            <h2 className="modal-title">Settings & Customization</h2>
            <p className="modal-text">Manage your profile, chat history, and feed topic choices.</p>

            <div className="settings-menu-grid">
              <button className="settings-menu-btn" onClick={() => openView('account')}>
                <div className="settings-btn-content">
                  <div className="settings-btn-icon">👤</div>
                  <div>
                    <div className="settings-btn-text">Account Details</div>
                    <div className="settings-btn-desc">Name, email, and password settings</div>
                  </div>
                </div>
                <span>➡️</span>
              </button>

              <button className="settings-menu-btn" onClick={() => openView('ai-history')}>
                <div className="settings-btn-content">
                  <div className="settings-btn-icon">💬</div>
                  <div>
                    <div className="settings-btn-text">AI Chat History</div>
                    <div className="settings-btn-desc">View past conversations</div>
                  </div>
                </div>
                <span>➡️</span>
              </button>

              <button className="settings-menu-btn" onClick={() => openView('topics')}>
                <div className="settings-btn-content">
                  <div className="settings-btn-icon">🎯</div>
                  <div>
                    <div className="settings-btn-text">Topic Selection</div>
                    <div className="settings-btn-desc">Customize your 4 groups & 14 categories</div>
                  </div>
                </div>
                <span>➡️</span>
              </button>
            </div>
          </div>
        )}

        {view === 'account' && (
          <div>
            <div className="subview-header">
              <button className="back-btn" onClick={() => setView('master')}>
                ← Settings
              </button>
              <h3 className="subview-heading">Account Details</h3>
            </div>
            <p className="modal-text">Real accounts land on Day 4 (Supabase Auth) — this is a preview of the form.</p>
            <div className="form-group">
              <label className="form-label">Display Name</label>
              <input type="text" className="form-input" defaultValue="Curious Learner" disabled />
            </div>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input type="email" className="form-input" defaultValue="learner@mindscroll.app" disabled />
            </div>
            <div className="form-group">
              <label className="form-label">Change Password</label>
              <input type="password" className="form-input" placeholder="••••••••" disabled />
            </div>
          </div>
        )}

        {view === 'ai-history' && (
          <div>
            <div className="subview-header">
              <button className="back-btn" onClick={() => setView('master')}>
                ← Settings
              </button>
              <h3 className="subview-heading">AI Chat History</h3>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, maxHeight: 320, overflowY: 'auto' }}>
              {threadKeys.length === 0 ? (
                <div className="empty-state">No past conversations yet. Start a chat on any card!</div>
              ) : (
                threadKeys.map((key) => {
                  const thread = chatThreads[key];
                  const lastMsg = thread.messages[thread.messages.length - 1];
                  const snippet = lastMsg ? lastMsg.text.replace(/\*\*/g, '').slice(0, 45) + '...' : 'Conversation thread';
                  return (
                    <div
                      className="ai-thread-card"
                      key={key}
                      onClick={() => {
                        setView('master');
                        onContinueThread(key);
                      }}
                    >
                      <div>
                        <div className="ai-thread-title">💬 {thread.title}</div>
                        <div className="ai-thread-snippet">{snippet}</div>
                      </div>
                      <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--accent-maroon)' }}>Continue ➡️</span>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

        {view === 'topics' && (
          <div>
            <div className="subview-header">
              <button className="back-btn" onClick={() => setView('master')}>
                ← Settings
              </button>
              <h3 className="subview-heading">Topic Selection</h3>
            </div>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: 14 }}>
              Select a Group to view and check its categories. Checked categories fuel your 70% feed. Unchecked
              categories fuel your 30% discovery.
              <br />
              <strong style={{ color: 'var(--accent-maroon)' }}>(Islam is excluded unless checked)</strong>.
            </p>

            <div className="group-selector-grid">
              {Object.keys(GROUP_TAXONOMY).map((group) => (
                <div
                  key={group}
                  className={`group-card ${activeGroup === group ? 'active' : ''}`}
                  onClick={() => setActiveGroup(group)}
                >
                  <div className="group-card-icon">{GROUP_ICONS[group]}</div>
                  <div className="group-card-title">{group}</div>
                </div>
              ))}
            </div>

            <div className="checklist-grid">
              {GROUP_TAXONOMY[activeGroup].map((cat) => (
                <label className="check-item" key={cat}>
                  <input type="checkbox" checked={draftCategories.has(cat)} onChange={() => toggleCategory(cat)} />
                  <span className="check-label">{cat}</span>
                </label>
              ))}
            </div>

            <button className="primary-btn" style={{ marginTop: 16 }} onClick={saveAndClose}>
              Save Topic Preferences
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
