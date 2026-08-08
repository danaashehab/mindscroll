export interface CardResource {
  type: string;
  title: string;
  url: string;
}

export interface CardSourceReference {
  name: string;
  url: string;
}

export interface Card {
  id: string;
  group: string;
  category: string;
  levelNum: number;
  title: string;
  level1: {
    summary: string;
  };
  level2: {
    howItWorks: string;
    whyItMatters: string;
    example: string;
    sourceReference: CardSourceReference;
    resources: CardResource[];
  };
}

export interface ChatMessage {
  role: 'user' | 'ai';
  text: string;
}

export interface ChatThread {
  title: string;
  cardId: string;
  messages: ChatMessage[];
}

export type ChatThreads = Record<string, ChatThread>;

export type EngagementScores = Record<string, number>;
