'use client';

import { useEffect, useRef, useState } from 'react';
import type { Card, ChatThreads } from '@/lib/types';
import { formatAiMessageHtml } from '@/lib/format';
import { IconClose, IconSend } from './icons';

interface AiChatDrawerProps {
  open: boolean;
  card: Card | undefined;
  chatThreads: ChatThreads;
  activeThreadKey: string | null;
  isSending: boolean;
  onClose: () => void;
  onSend: (question: string) => void;
}

const PROMPT_CHIPS = [
  { label: '💡 Explain with analogy', prompt: 'Explain this concept with a simple everyday analogy.' },
  { label: '🌍 Everyday application', prompt: 'How does this apply to real life situations?' },
  { label: '❓ Common misconceptions', prompt: 'What is a common misconception about this topic?' },
];

export function AiChatDrawer({ open, card, chatThreads, activeThreadKey, isSending, onClose, onSend }: AiChatDrawerProps) {
  const [input, setInput] = useState('');
  const messagesRef = useRef<HTMLDivElement>(null);
  const thread = activeThreadKey ? chatThreads[activeThreadKey] : undefined;

  useEffect(() => {
    if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    }
  }, [thread?.messages.length]);

  function submit(question: string) {
    if (!question.trim()) return;
    onSend(question);
    setInput('');
  }

  return (
    <aside className={`drawer drawer-left ${open ? 'open' : ''}`}>
      <div className="drawer-header">
        <div className="drawer-title">
          <span>✨</span> AI Curiosity Tutor
        </div>
        <button className="icon-btn" onClick={onClose}>
          <IconClose />
        </button>
      </div>
      <div className="drawer-body">
        <div className="context-pill">
          <div className="context-pill-title">Active Context</div>
          <div className="context-pill-text">
            {thread ? `${thread.title}${card ? ` (${card.group}: ${card.category})` : ''}` : 'Loading context...'}
          </div>
        </div>

        <div className="chat-messages" ref={messagesRef}>
          {thread?.messages.map((msg, i) =>
            msg.role === 'ai' ? (
              <div className="chat-bubble ai" key={i} dangerouslySetInnerHTML={{ __html: formatAiMessageHtml(msg.text) }} />
            ) : (
              <div className="chat-bubble user" key={i}>
                {msg.text}
              </div>
            )
          )}
          {isSending && (
            <div className="chat-bubble ai" style={{ opacity: 0.6 }}>
              Thinking...
            </div>
          )}
        </div>

        <div className="prompt-chips">
          {PROMPT_CHIPS.map((chip) => (
            <button key={chip.prompt} className="chip-btn" onClick={() => submit(chip.prompt)}>
              {chip.label}
            </button>
          ))}
        </div>
      </div>
      <div className="chat-input-bar">
        <input
          type="text"
          className="chat-input"
          placeholder="Ask a question about this idea..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') submit(input);
          }}
        />
        <button className="send-btn" onClick={() => submit(input)}>
          <IconSend />
        </button>
      </div>
    </aside>
  );
}
