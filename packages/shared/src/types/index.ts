/**
 * Shared Types Index
 * Export all entity types and interfaces
 */

export * from './DailyBrief';
export * from './SecurityEvent';
export * from './SystemLog';
export * from './UserProfile';
export * from './Vision';

/**
 * Common utility types
 */
export interface PagedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: Date;
}
