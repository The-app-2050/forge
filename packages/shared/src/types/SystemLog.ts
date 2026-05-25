/**
 * SystemLog Entity
 * Represents a system action/event logged for auditing and debugging
 */

export interface SystemLog {
  id: string;
  userId: string;
  action: string;
  reason?: string;
  agentName: string;
  impact?: string;
  timestamp: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateSystemLogInput {
  action: string;
  reason?: string;
  agentName: string;
  impact?: string;
}

export interface UpdateSystemLogInput {
  action?: string;
  reason?: string;
  agentName?: string;
  impact?: string;
}

export type SystemLogResponse = Omit<SystemLog, 'userId'>;
