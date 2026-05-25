/**
 * Vision Entity
 * Represents user visions, notes, and insights with AI-generated responses
 */

export type VisionType = 'vision' | 'note' | 'insight';

export interface Vision {
  id: string;
  userId: string;
  name: string;
  manifestation: string;
  type: VisionType;
  forgedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateVisionInput {
  name: string;
  manifestation?: string;
  type?: VisionType;
  forgedAt?: Date;
}

export interface UpdateVisionInput {
  name?: string;
  manifestation?: string;
  type?: VisionType;
}

export type VisionResponse = Omit<Vision, 'userId'>;
