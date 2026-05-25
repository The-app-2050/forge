/**
 * SecurityEvent Entity
 * Represents a security event (motion, door, pattern detection, etc.)
 */

export type SecurityEventCategory = 'motion' | 'door' | 'pattern' | 'purge' | 'scan' | 'test';

export interface SecurityEvent {
  id: string;
  userId: string;
  title: string;
  body: string;
  category: SecurityEventCategory;
  timestamp: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateSecurityEventInput {
  title: string;
  body: string;
  category: SecurityEventCategory;
}

export interface UpdateSecurityEventInput {
  title?: string;
  body?: string;
  category?: SecurityEventCategory;
}

export type SecurityEventResponse = Omit<SecurityEvent, 'userId'>;
