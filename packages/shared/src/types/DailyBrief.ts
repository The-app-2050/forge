/**
 * DailyBrief Entity
 * Represents an AI-generated morning briefing for a user
 */

export interface DailyBrief {
  id: string;
  userId: string;
  content: string;
  briefDate: string; // YYYY-MM-DD format
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateDailyBriefInput {
  content: string;
  briefDate: string; // YYYY-MM-DD format
}

export interface UpdateDailyBriefInput {
  content?: string;
  briefDate?: string;
}

export type DailyBriefResponse = Omit<DailyBrief, 'userId'>;
