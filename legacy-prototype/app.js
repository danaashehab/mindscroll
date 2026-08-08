// MindScroll Prototype Core Logic v5
document.addEventListener('DOMContentLoaded', () => {
  // State variables
  let rawCards = [];
  let queue = [];
  let currentIndex = 0;
  let favoritedCardIds = new Set(JSON.parse(localStorage.getItem('mindscroll_favorites') || '[]'));
  let seenCardIds = new Set(JSON.parse(localStorage.getItem('mindscroll_seen') || '[]'));
  let topicEngagementScores = JSON.parse(localStorage.getItem('mindscroll_engagement') || '{}');
  
  // Stored AI Chat Threads (Keyed by Card ID or Standalone ID)
  // Format: { "neuro-001": { title: "Neuroplasticity: The Rewiring Brain", messages: [...] } }
  let aiChatThreads = JSON.parse(localStorage.getItem('mindscroll_ai_threads') || '{}');
  let currentActiveThreadKey = null;

  // Selected Categories (Default: all except Islam)
  let selectedCategories = new Set(JSON.parse(localStorage.getItem('mindscroll_categories') || JSON.stringify([
    "Business & Economics", "Mythology", "History, Society & Anthropology",
    "Psychology", "Neuroscience", "Philosophy & Thinking",
    "Astronomy", "Physics", "Health & Biology", "Technology",
    "Mysteries", "Creativity", "Random Facts"
  ])));

  let geminiApiKey = localStorage.getItem('mindscroll_gemini_key') || '';

  // Taxonomy Mapping
  const groupTaxonomy = {
    "The World": ["Business & Economics", "Mythology", "Islam & Wisdom", "History, Society & Anthropology"],
    "The Mind": ["Psychology", "Neuroscience", "Philosophy & Thinking"],
    "Science": ["Astronomy", "Physics", "Health & Biology", "Technology"],
    "Curiosity": ["Mysteries", "Creativity", "Random Facts"]
  };

  let activeSettingsGroup = "The World";

  // Live Touch Drag Variables
  let isDragging = false;
  let startX = 0;
  let startY = 0;
  let currentX = 0;
  let currentY = 0;

  // DOM Elements
  const viewport = document.getElementById('card-viewport');
  const deepDiveDrawer = document.getElementById('deep-dive-drawer');
  const deepDiveContent = document.getElementById('deep-dive-content');
  const closeDeepDiveBtn = document.getElementById('close-deep-dive-drawer');

  const favoritesDrawer = document.getElementById('favorites-drawer');
  const favoritesList = document.getElementById('favorites-list');
  const favsBtn = document.getElementById('favs-btn');
  const closeFavsBtn = document.getElementById('close-favs-drawer');

  const aiDrawer = document.getElementById('ai-drawer');
  const closeAiBtn = document.getElementById('close-ai-drawer');
  const aiCardTitleText = document.getElementById('ai-card-title-text');
  const chatMessages = document.getElementById('chat-messages');
  const chatInput = document.getElementById('chat-input');
  const sendChatBtn = document.getElementById('send-chat-btn');
  const promptChips = document.getElementById('prompt-chips');

  const onboardingModal = document.getElementById('onboarding-modal');
  const closeOnboardingBtn = document.getElementById('close-onboarding-btn');

  // Settings Elements
  const settingsModal = document.getElementById('settings-modal');
  const settingsBtn = document.getElementById('settings-btn');
  const settingsMasterView = document.getElementById('settings-master-view');
  
  const btnGotoAccount = document.getElementById('btn-goto-account');
  const btnGotoAiHistory = document.getElementById('btn-goto-ai-history');
  const btnGotoTopics = document.getElementById('btn-goto-topics');

  const subviewAccount = document.getElementById('subview-account');
  const subviewAiHistory = document.getElementById('subview-ai-history');
  const subviewTopics = document.getElementById('subview-topics');

  const btnStartStandaloneAi = document.getElementById('btn-start-standalone-ai');
  const aiHistoryListEl = document.getElementById('ai-history-list');
  const geminiKeyInput = document.getElementById('gemini-key-input');
  const groupSelectorCards = document.getElementById('group-selector-cards');
  const groupCategoriesChecklist = document.getElementById('group-categories-checklist');

  // Desktop Controls
  const navUpBtn = document.getElementById('nav-up-btn');
  const navDownBtn = document.getElementById('nav-down-btn');
  const navLeftBtn = document.getElementById('nav-left-btn');
  const navRightBtn = document.getElementById('nav-right-btn');

  // 1. Load Dataset
  fetch('data/cards.json')
    .then(r => r.json())
    .then(data => {
      rawCards = data;
      initApp();
    })
    .catch(err => {
      console.warn('Using embedded dataset fallback:', err);
      rawCards = getFallbackDataset();
      initApp();
    });

  function initApp() {
    buildRecommendationQueue();
    renderCurrentCard();
    checkOnboarding();
  }

  function getFallbackDataset() {
    return [
      {
        "id": "biz-001", "group": "The World", "category": "Business & Economics", "levelNum": 1,
        "title": "The Cobra Effect: Perverse Incentives",
        "level1": { "summary": "When a reward or policy produces the exact opposite result of what was intended due to unintended human behavioral loopholes." },
        "level2": {
          "howItWorks": "When the British government offered a bounty for dead cobras in Delhi to reduce snake population, citizens began breeding cobras to collect money.",
          "whyItMatters": "It demonstrates why economic policies and corporate incentives must account for strategic human gaming.",
          "example": "Offering programmers bonuses per line of code written leads to bloated, inefficient code rather than better software.",
          "sourceReference": { "name": "Harvard Business Review", "url": "https://hbr.org/2012/09/the-cobra-effect-in-business" },
          "resources": [{ "type": "article", "title": "Perverse Incentives — Wikipedia", "url": "https://en.wikipedia.org/wiki/Perverse_incentive" }]
        }
      },
      {
        "id": "myth-001", "group": "The World", "category": "Mythology", "levelNum": 1,
        "title": "The Myth of Icarus & Daedalus",
        "level1": { "summary": "Icarus flew too close to the sun with wings made of wax and feathers. The myth serves as a timeless warning against hubris." },
        "level2": {
          "howItWorks": "Daedalus warned his son neither to fly too low nor too high. Driven by euphoria, Icarus ignored the middle path.",
          "whyItMatters": "Modern literature and psychology use Icarus to illustrate the danger of uncontrolled ambition.",
          "example": "Overhyped startups overspending during boom periods often suffer an 'Icarus collapse' when economic conditions turn cold.",
          "sourceReference": { "name": "Stanford Encyclopedia of Philosophy", "url": "https://plato.stanford.edu/entries/greek-mythology/" },
          "resources": [{ "type": "article", "title": "Daedalus & Icarus — Encyclopedia Britannica", "url": "https://www.britannica.com/topic/Daedalus-Greek-mythology" }]
        }
      },
      {
        "id": "neuro-001", "group": "The Mind", "category": "Neuroscience", "levelNum": 1,
        "title": "Neuroplasticity: The Rewiring Brain",
        "level1": { "summary": "Your brain physically restructures its connections every time you learn a new skill, form a habit, or adapt to new experiences." },
        "level2": {
          "howItWorks": "Neurons that fire together wire together. Repeating an activity strengthens synaptic connections, adding myelin sheaths around neural pathways.",
          "whyItMatters": "It proves scientifically that age is no barrier to learning new skills and unlearning toxic habits.",
          "example": "When learning piano, your fingers feel clumsy at first. After 30 days of practice, the pathway becomes an automatic highway.",
          "sourceReference": { "name": "Nature Reviews Neuroscience", "url": "https://www.nature.com/nrn/" },
          "resources": [{ "type": "video", "title": "After Watching This, Your Brain Will Not Be the Same — TED-Ed", "url": "https://www.youtube.com/watch?v=LNHBMFCzznE" }]
        }
      },
      {
        "id": "astro-001", "group": "Science", "category": "Astronomy", "levelNum": 1,
        "title": "Time Dilation: Gravity Bends Time",
        "level1": { "summary": "Time does not tick at a constant rate across the universe. Near massive objects or at extreme speeds, time literally moves slower." },
        "level2": {
          "howItWorks": "Einstein's Theory of General Relativity proved that mass warps spacetime, slowing the passage of time relative to an outside observer.",
          "whyItMatters": "GPS satellites orbiting Earth must adjust their internal clocks daily by 38 microseconds; otherwise, smartphone navigation would drift off.",
          "example": "An astronaut lingering near a supermassive black hole for 1 hour returns to Earth to find 7 human years have passed.",
          "sourceReference": { "name": "NASA Astrophysics Data System", "url": "https://ui.adsabs.harvard.edu" },
          "resources": [{ "type": "video", "title": "Einstein's Relativity & Time Dilation — YouTube", "url": "https://www.youtube.com/watch?v=yuD34tEpRFw" }]
        }
      }
    ];
  }

  // 2. Strict Non-Repeating Queue & Instant Progression Engine
  function buildRecommendationQueue() {
    if (rawCards.length === 0) return;

    const isIslamChecked = selectedCategories.has("Islam & Wisdom");

    // Eligible cards: exclude Islam unless checked
    let eligibleCards = rawCards.filter(card => {
      if (card.category === "Islam & Wisdom" && !isIslamChecked) return false;
      return true;
    });

    // Exclude cards seen during current session (to guarantee zero repetition)
    let unvisitedCards = eligibleCards.filter(c => !seenCardIds.has(c.id));
    if (unvisitedCards.length === 0) {
      // If all unvisited, reset session seen tracker so feed continues smoothly
      seenCardIds.clear();
      unvisitedCards = eligibleCards;
    }

    // Sort by topic engagement score (high engagement topic -> serve Level 2/3 cards first)
    unvisitedCards.sort((a, b) => {
      const scoreA = topicEngagementScores[a.category] || 0;
      const scoreB = topicEngagementScores[b.category] || 0;
      const prefA = (scoreA * 10) + a.levelNum;
      const prefB = (scoreB * 10) + b.levelNum;
      return prefB - prefA;
    });

    queue = unvisitedCards;
    currentIndex = 0;
  }

  function boostTopicEngagement(category) {
    topicEngagementScores[category] = (topicEngagementScores[category] || 0) + 1;
    localStorage.setItem('mindscroll_engagement', JSON.stringify(topicEngagementScores));
    // Immediately rebuild queue with updated level progression
    buildRecommendationQueue();
  }

  // 3. Render Card & Attach Interactive Drag Physics
  function renderCurrentCard(direction = 'none') {
    if (queue.length === 0) return;

    const card = queue[currentIndex];
    seenCardIds.add(card.id);
    localStorage.setItem('mindscroll_seen', JSON.stringify([...seenCardIds]));

    const isFavorited = favoritedCardIds.has(card.id);
    const categoryBadgeText = `${card.group}: ${card.category}`;

    const cardElement = document.createElement('div');
    cardElement.className = 'curiosity-card';
    cardElement.id = 'active-card';

    if (direction === 'up') {
      cardElement.style.transform = 'translateY(60%) scale(0.95)';
      cardElement.style.opacity = '0';
    } else if (direction === 'down') {
      cardElement.style.transform = 'translateY(-60%) scale(0.95)';
      cardElement.style.opacity = '0';
    }

    cardElement.innerHTML = `
      <div class="card-header">
        <span class="category-badge">${categoryBadgeText}</span>
      </div>

      <div class="card-body">
        <h1 class="card-title">${card.title}</h1>
        <p class="card-summary">${card.level1.summary}</p>
      </div>

      <div class="card-footer">
        <span class="card-level-tag">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="16"></line></svg>
          Level ${card.levelNum || 1} ${card.levelNum === 3 ? '(Theories)' : ''}
        </span>
        <button class="fav-btn ${isFavorited ? 'favorited' : ''}" id="card-fav-btn">
          <span>📌</span>
          <span>${isFavorited ? 'Favorited' : 'Favorite'}</span>
        </button>
      </div>
    `;

    viewport.innerHTML = '';
    viewport.appendChild(cardElement);

    requestAnimationFrame(() => {
      cardElement.style.transform = 'translateY(0) scale(1)';
      cardElement.style.opacity = '1';
    });

    document.getElementById('card-fav-btn').addEventListener('click', toggleFavorite);

    // Clean touch gesture listeners (card stays steady during gesture)
    cardElement.addEventListener('touchstart', handleTouchStart, { passive: true });
    cardElement.addEventListener('touchend', handleTouchEnd, { passive: true });
  }

  // Clean gesture detection without card wobble
  function handleTouchStart(e) {
    touchStartX = e.changedTouches[0].screenX;
    touchStartY = e.changedTouches[0].screenY;
  }

  function handleTouchEnd(e) {
    const touchEndX = e.changedTouches[0].screenX;
    const touchEndY = e.changedTouches[0].screenY;

    const deltaX = touchEndX - touchStartX;
    const deltaY = touchEndY - touchStartY;
    const threshold = 45;

    if (Math.abs(deltaY) > Math.abs(deltaX)) {
      if (deltaY < -threshold) nextCard();
      else if (deltaY > threshold) prevCard();
    } else {
      if (deltaX > threshold) openDeepDiveDrawer();
      else if (deltaX < -threshold) openAiDrawer();
    }
  }

  // 4. Navigation Handlers
  function nextCard() {
    closeDrawers();
    if (queue.length === 0) return;
    currentIndex = (currentIndex + 1) % queue.length;
    renderCurrentCard('up');
  }

  function prevCard() {
    closeDrawers();
    if (queue.length === 0) return;
    currentIndex = (currentIndex - 1 + queue.length) % queue.length;
    renderCurrentCard('down');
  }

  document.addEventListener('keydown', (e) => {
    if (document.activeElement.tagName === 'INPUT') return;

    if (e.key === 'ArrowDown') nextCard();
    else if (e.key === 'ArrowUp') prevCard();
    else if (e.key === 'ArrowRight') openDeepDiveDrawer();
    else if (e.key === 'ArrowLeft') openAiDrawer();
    else if (e.key === 'Escape') {
      closeDrawers();
      closeModals();
    }
  });

  navUpBtn.addEventListener('click', prevCard);
  navDownBtn.addEventListener('click', nextCard);
  navLeftBtn.addEventListener('click', openAiDrawer);
  navRightBtn.addEventListener('click', openDeepDiveDrawer);

  // 5. Favorite & Drawer
  function toggleFavorite() {
    const card = queue[currentIndex];
    if (favoritedCardIds.has(card.id)) {
      favoritedCardIds.delete(card.id);
    } else {
      favoritedCardIds.add(card.id);
      boostTopicEngagement(card.category);
    }
    localStorage.setItem('mindscroll_favorites', JSON.stringify([...favoritedCardIds]));
    renderCurrentCard();
    renderFavoritesDrawerList();
  }

  function openFavoritesDrawer() {
    renderFavoritesDrawerList();
    closeDrawers();
    favoritesDrawer.classList.add('open');
  }

  function renderFavoritesDrawerList() {
    const favCards = rawCards.filter(c => favoritedCardIds.has(c.id));

    if (favCards.length === 0) {
      favoritesList.innerHTML = `<div style="text-align: center; color: var(--text-muted); padding: 40px 10px;">No favorited ideas yet. Click the 📌 Favorite button on any card to save it here!</div>`;
      return;
    }

    favoritesList.innerHTML = favCards.map(c => `
      <div class="fav-item-card" data-id="${c.id}" style="cursor: pointer;">
        <div>
          <div class="fav-item-cat">${c.group}: ${c.category}</div>
          <div class="fav-item-title">${c.title}</div>
        </div>
        <span style="font-size: 1.2rem;">📌</span>
      </div>
    `).join('');

    favoritesList.querySelectorAll('.fav-item-card').forEach(item => {
      item.addEventListener('click', () => {
        const id = item.getAttribute('data-id');
        const cardIdx = queue.findIndex(q => q.id === id);
        if (cardIdx !== -1) {
          currentIndex = cardIdx;
          renderCurrentCard();
        }
        closeDrawers();
      });
    });
  }

  favsBtn.addEventListener('click', openFavoritesDrawer);
  closeFavsBtn.addEventListener('click', () => favoritesDrawer.classList.remove('open'));

  // 6. Deep Dive Drawer & Working Links
  function openDeepDiveDrawer() {
    const card = queue[currentIndex];
    boostTopicEngagement(card.category);
    const level2 = card.level2;

    deepDiveContent.innerHTML = `
      <div class="deep-dive-section">
        <div class="section-label">Concept Breakdown</div>
        <h2 style="font-family: 'Outfit'; font-size: 1.3rem; color: var(--accent-maroon-dark); margin-bottom: 12px;">${card.title}</h2>
        <p class="section-content">${level2.howItWorks}</p>
      </div>

      <div class="deep-dive-section">
        <div class="section-label">Why It Matters</div>
        <p class="section-content">${level2.whyItMatters}</p>
      </div>

      <div class="deep-dive-section">
        <div class="section-label">Real-World Application</div>
        <p class="section-content">${level2.example}</p>
      </div>

      ${level2.sourceReference ? `
        <div class="source-citation-badge">
          <div>
            <div class="citation-title">Peer-Reviewed / Trusted Source</div>
            <div class="citation-name">${level2.sourceReference.name}</div>
          </div>
          <a href="${level2.sourceReference.url}" target="_blank" rel="noopener noreferrer" style="color: var(--accent-maroon); text-decoration: none; font-size: 0.85rem; font-weight: 700;">Verify ↗</a>
        </div>
      ` : ''}

      <div class="deep-dive-section" style="margin-top: 10px;">
        <div class="section-label">Curated External Resources</div>
        ${level2.resources.map(res => `
          <a href="${res.url}" target="_blank" rel="noopener noreferrer" class="resource-card">
            <div>
              <div style="font-size: 0.72rem; font-weight: 700; text-transform: uppercase; color: var(--accent-maroon);">${res.type}</div>
              <div style="font-size: 0.88rem; font-weight: 600; margin-top: 2px;">${res.title}</div>
            </div>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
          </a>
        `).join('')}
      </div>
    `;

    closeDrawers();
    deepDiveDrawer.classList.add('open');
  }

  closeDeepDiveBtn.addEventListener('click', () => deepDiveDrawer.classList.remove('open'));

  // 7. Grouped AI Chat History & Card Conversation Threads
  function openAiDrawer(overrideCardId = null) {
    const card = queue[currentIndex];
    const cardId = overrideCardId || (card ? card.id : null);
    if (!cardId) return;

    const cardTitle = card ? `${card.title}` : "Card Conversation";
    currentActiveThreadKey = cardId;
    boostTopicEngagement(card.category);

    // Initialize or load thread for active card
    if (!aiChatThreads[currentActiveThreadKey]) {
      aiChatThreads[currentActiveThreadKey] = {
        title: cardTitle,
        cardId: cardId,
        messages: [
          { role: 'ai', text: `Hello! I'm your **MindScroll AI Tutor**. Ask me anything about **${cardTitle}**!` }
        ]
      };
      saveAiThreads();
    }

    const thread = aiChatThreads[currentActiveThreadKey];
    aiCardTitleText.textContent = `${thread.title} (${card.group}: ${card.category})`;

    // Render full chat thread messages
    chatMessages.innerHTML = '';
    thread.messages.forEach(msg => {
      if (msg.role === 'ai') renderAiMessage(msg.text);
      else renderUserMessage(msg.text);
    });

    closeDrawers();
    aiDrawer.classList.add('open');
  }

  closeAiBtn.addEventListener('click', () => aiDrawer.classList.remove('open'));

  function saveAiThreads() {
    localStorage.setItem('mindscroll_ai_threads', JSON.stringify(aiChatThreads));
  }

  function renderAiMessage(text) {
    const bubble = document.createElement('div');
    bubble.className = 'chat-bubble ai';
    const formatted = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    bubble.innerHTML = formatted;
    chatMessages.appendChild(bubble);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  function renderUserMessage(text) {
    const bubble = document.createElement('div');
    bubble.className = 'chat-bubble user';
    bubble.textContent = text;
    chatMessages.appendChild(bubble);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  async function handleSendChat(userQuestionText) {
    const question = userQuestionText || chatInput.value.trim();
    if (!question || !currentActiveThreadKey) return;

    renderUserMessage(question);
    chatInput.value = '';

    // Record user message in thread
    aiChatThreads[currentActiveThreadKey].messages.push({ role: 'user', text: question });
    saveAiThreads();

    const loadingBubble = document.createElement('div');
    loadingBubble.className = 'chat-bubble ai';
    loadingBubble.innerHTML = `<span style="opacity: 0.6;">Thinking...</span>`;
    chatMessages.appendChild(loadingBubble);
    chatMessages.scrollTop = chatMessages.scrollHeight;

    const card = queue[currentIndex];
    let aiResponseText = '';

    if (geminiApiKey) {
      try {
        const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${geminiApiKey}`;
        const promptText = `
System Context: You are MindScroll AI tutor. Active Topic: ${aiChatThreads[currentActiveThreadKey].title}.
User Question: ${question}
Keep response concise, clear, and engaging (under 120 words).
        `;

        const res = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ contents: [{ parts: [{ text: promptText }] }] })
        });
        const data = await res.json();
        const candidateText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (!candidateText) {
          throw new Error(data?.error?.message || data?.promptFeedback?.blockReason || 'Empty response from Gemini API');
        }
        aiResponseText = candidateText;
      } catch (err) {
        console.error('Gemini API Error:', err);
        aiResponseText = generateSmartMockResponse(question, card);
      }
    } else {
      await new Promise(resolve => setTimeout(resolve, 700));
      aiResponseText = generateSmartMockResponse(question, card);
    }

    loadingBubble.remove();
    renderAiMessage(aiResponseText);

    // Record AI reply in thread
    aiChatThreads[currentActiveThreadKey].messages.push({ role: 'ai', text: aiResponseText });
    saveAiThreads();
  }

  function generateSmartMockResponse(question, card) {
    const qLower = question.toLowerCase();
    if (qLower.includes('analogy')) {
      return `Think of this concept like an architect's blueprint: every structural choice dictates how the overall framework functions under load.`;
    }
    return `Great question! The core mechanism relies on progressive adaptation—strengthening understanding step-by-step through focused curiosity.`;
  }

  sendChatBtn.addEventListener('click', () => handleSendChat());
  chatInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') handleSendChat();
  });

  promptChips.addEventListener('click', (e) => {
    if (e.target.classList.contains('chip-btn')) {
      handleSendChat(e.target.getAttribute('data-prompt'));
    }
  });

  // 8. 3-Button Settings Navigation & Grouped AI History Render
  function showSettingsMasterView() {
    settingsMasterView.style.display = 'block';
    subviewAccount.classList.remove('active');
    subviewAiHistory.classList.remove('active');
    subviewTopics.classList.remove('active');
  }

  function showSubview(subviewEl) {
    settingsMasterView.style.display = 'none';
    subviewAccount.classList.remove('active');
    subviewAiHistory.classList.remove('active');
    subviewTopics.classList.remove('active');
    subviewEl.classList.add('active');
  }

  btnGotoAccount.addEventListener('click', () => showSubview(subviewAccount));
  btnGotoAiHistory.addEventListener('click', () => {
    renderAiHistoryUI();
    showSubview(subviewAiHistory);
  });
  btnGotoTopics.addEventListener('click', () => {
    renderGroupCategoriesUI(activeSettingsGroup);
    showSubview(subviewTopics);
  });

  document.querySelectorAll('.back-to-master, .back-btn').forEach(btn => {
    btn.addEventListener('click', showSettingsMasterView);
  });

  // Render Grouped AI Chat History List
  function renderAiHistoryUI() {
    geminiKeyInput.value = geminiApiKey;

    const threadKeys = Object.keys(aiChatThreads);
    if (threadKeys.length === 0) {
      aiHistoryListEl.innerHTML = `<div style="font-size: 0.8rem; color: var(--text-muted); text-align: center; padding: 16px;">No past conversations yet. Start a chat on any card or create a standalone chat!</div>`;
      return;
    }

    aiHistoryListEl.innerHTML = threadKeys.map(key => {
      const thread = aiChatThreads[key];
      const lastMsg = thread.messages[thread.messages.length - 1];
      const snippet = lastMsg ? lastMsg.text.replace(/\*\*/g, '').substring(0, 45) + '...' : 'Conversation thread';

      return `
        <div class="ai-thread-card" data-thread-key="${key}">
          <div>
            <div class="ai-thread-title">💬 ${thread.title}</div>
            <div class="ai-thread-snippet">${snippet}</div>
          </div>
          <span style="font-size: 0.8rem; font-weight: 700; color: var(--accent-maroon);">Continue ➡️</span>
        </div>
      `;
    }).join('');

    // Attach thread click listeners to continue conversation
    aiHistoryListEl.querySelectorAll('.ai-thread-card').forEach(cardEl => {
      cardEl.addEventListener('click', () => {
        const key = cardEl.getAttribute('data-thread-key');
        closeModals();
        openAiDrawer(key);
      });
    });
  }

  // Topic Group Checkbox Handler
  groupSelectorCards.querySelectorAll('.group-card').forEach(card => {
    card.addEventListener('click', () => {
      groupSelectorCards.querySelectorAll('.group-card').forEach(c => c.classList.remove('active'));
      card.classList.add('active');
      activeSettingsGroup = card.getAttribute('data-group');
      renderGroupCategoriesUI(activeSettingsGroup);
    });
  });

  function renderGroupCategoriesUI(groupName) {
    const categories = groupTaxonomy[groupName] || [];
    groupCategoriesChecklist.innerHTML = categories.map(cat => `
      <label class="check-item" ${cat === "Islam & Wisdom" ? 'style="border-color: rgba(122, 28, 45, 0.3);"' : ''}>
        <input type="checkbox" value="${cat}" ${selectedCategories.has(cat) ? 'checked' : ''}>
        <span class="check-label">${cat}</span>
      </label>
    `).join('');
  }

  // Save Settings Handlers
  document.querySelectorAll('.save-subview-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const checkboxes = groupCategoriesChecklist.querySelectorAll('input[type="checkbox"]');
      checkboxes.forEach(box => {
        if (box.checked) selectedCategories.add(box.value);
        else selectedCategories.delete(box.value);
      });

      localStorage.setItem('mindscroll_categories', JSON.stringify([...selectedCategories]));

      geminiApiKey = geminiKeyInput.value.trim();
      localStorage.setItem('mindscroll_gemini_key', geminiApiKey);

      buildRecommendationQueue();
      renderCurrentCard();

      closeModals();
    });
  });

  settingsBtn.addEventListener('click', () => {
    showSettingsMasterView();
    settingsModal.classList.add('active');
  });

  // Helpers
  function closeDrawers() {
    deepDiveDrawer.classList.remove('open');
    aiDrawer.classList.remove('open');
    favoritesDrawer.classList.remove('open');
  }

  function closeModals() {
    onboardingModal.classList.remove('active');
    settingsModal.classList.remove('active');
  }

  function checkOnboarding() {
    const onboardingSeen = localStorage.getItem('mindscroll_onboarding_v5');
    if (!onboardingSeen) {
      onboardingModal.classList.add('active');
    }
  }

  closeOnboardingBtn.addEventListener('click', () => {
    localStorage.setItem('mindscroll_onboarding_v5', 'true');
    onboardingModal.classList.remove('active');
  });

  onboardingModal.addEventListener('click', (e) => {
    if (e.target === onboardingModal) onboardingModal.classList.remove('active');
  });

  settingsModal.addEventListener('click', (e) => {
    if (e.target === settingsModal) settingsModal.classList.remove('active');
  });
});
