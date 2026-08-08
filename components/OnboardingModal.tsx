'use client';

interface OnboardingModalProps {
  open: boolean;
  onClose: () => void;
}

export function OnboardingModal({ open, onClose }: OnboardingModalProps) {
  return (
    <div
      className={`modal-overlay ${open ? 'active' : ''}`}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="modal-card">
        <h2 className="modal-title">Welcome to MindScroll</h2>
        <p className="modal-text">
          Replace mindless scrolling with genuine curiosity. Here is how to navigate each card:
        </p>

        <div className="gesture-guide-grid">
          <div className="guide-item">
            <div className="guide-icon">⬆️</div>
            <div className="guide-label">
              Swipe Up / Down
              <br />
              New Idea
            </div>
          </div>
          <div className="guide-item">
            <div className="guide-icon">➡️</div>
            <div className="guide-label">
              Swipe Right
              <br />
              Deep Dive
            </div>
          </div>
          <div className="guide-item">
            <div className="guide-icon">⬅️</div>
            <div className="guide-label">
              Swipe Left
              <br />
              AI Tutor
            </div>
          </div>
        </div>

        <button className="primary-btn" onClick={onClose}>
          Start Exploring
        </button>
      </div>
    </div>
  );
}
