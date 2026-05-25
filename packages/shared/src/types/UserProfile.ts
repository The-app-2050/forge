/**
 * UserProfile Entity
 * Represents user account and preferences
 */

export type PreferredStyle = 'cinematic' | 'stealth' | 'developer';

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  location?: string;
  preferredStyle: PreferredStyle;
  isPremium: boolean;
  forgedAt: Date;
  lastLoginAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateUserProfileInput {
  email: string;
  name: string;
  location?: string;
  preferredStyle?: PreferredStyle;
}

export interface UpdateUserProfileInput {
  name?: string;
  location?: string;
  preferredStyle?: PreferredStyle;
  isPremium?: boolean;
}

export type UserProfileResponse = Omit<UserProfile, 'email'>;
