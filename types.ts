export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export type ChatMode = 'triage' | 'preventive' | 'preliminary';
