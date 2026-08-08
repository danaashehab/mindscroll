# MindScroll - Content Data Schema & Sample Data v4

This document defines the JSON structure used in `data/cards.json` for Curiosity Cards (Level 1), Deep Dives (Level 2), and Theories & Discoveries (Level 3).

---

## 1. JSON Card Schema Definition

```json
{
  "id": "string",                  // Unique identifier (e.g., "neuro-001")
  "group": "string",               // Main Group ("The World", "The Mind", "Science", "Curiosity")
  "category": "string",            // Category Name (e.g., "Neuroscience")
  "levelNum": 1,                   // 1 = Curiosity, 2 = Deep Dive, 3 = Theories & Discoveries
  "title": "string",               // Concept Title
  "level1": {
    "summary": "string"            // Short, intriguing concept summary
  },
  "level2": {
    "howItWorks": "string",        // Detailed breakdown
    "whyItMatters": "string",      // Significance & real-world relevance
    "example": "string",           // Relatable everyday example
    "sourceReference": {           // Peer-Reviewed / Trusted Source Citation
      "name": "string",            // e.g. "Nature Reviews Neuroscience"
      "url": "string"              // URL to source publication
    },
    "resources": [                 // Curated external recommendations
      {
        "type": "video | book | article",
        "title": "string",
        "url": "string"
      }
    ]
  }
}
```

---

## 2. Sample Data (`cards.json`) Example

```json
[
  {
    "id": "neuro-001",
    "group": "The Mind",
    "category": "Neuroscience",
    "levelNum": 1,
    "title": "Neuroplasticity: The Rewiring Brain",
    "level1": {
      "summary": "Your brain physically restructures its connections every time you learn a new skill, form a habit, or adapt to new experiences."
    },
    "level2": {
      "howItWorks": "Neurons that fire together wire together. Repeating an activity strengthens synaptic connections, adding myelin sheaths around neural pathways.",
      "whyItMatters": "It proves scientifically that age is no barrier to learning new skills and unlearning toxic habits.",
      "example": "When learning piano, your fingers feel clumsy at first. After 30 days of practice, the pathway becomes an automatic highway.",
      "sourceReference": {
        "name": "Nature Reviews Neuroscience",
        "url": "https://www.nature.com/nrn"
      },
      "resources": [
        {
          "type": "video",
          "title": "After Watching This, Your Brain Will Not Be the Same (TED-Ed)",
          "url": "https://www.youtube.com/watch?v=LNHBMFCzznE"
        }
      ]
    }
  },
  {
    "id": "astro-002",
    "group": "Science",
    "category": "Astronomy",
    "levelNum": 3,
    "title": "Dark Matter & Unsolved Cosmic Masses",
    "level1": {
      "summary": "Theory & Frontier Discovery: Over 85% of matter in the universe is invisible and undetectable except through its gravitational pull on galaxies."
    },
    "level2": {
      "howItWorks": "Galactic rotation curves show outer stars moving faster than visible mass allows. Unseen 'dark matter halos' must exist to prevent galaxies from flying apart.",
      "whyItMatters": "It forces scientists to question whether our current Understanding of Gravity or Particle Physics is fundamentally incomplete.",
      "example": "Observing an invisible dancer spinning a partner across a stage—you see the partner swinging in circles, proving the invisible dancer's gravitational presence.",
      "sourceReference": {
        "name": "NASA Chandra X-Ray Observatory & CERN Research",
        "url": "https://chandra.harvard.edu"
      },
      "resources": [
        {
          "type": "article",
          "title": "Frontier Physics: The Search for WIMPs and Axions",
          "url": "https://www.google.com/search?q=Dark+Matter+theories+CERN"
        }
      ]
    }
  }
]
```
