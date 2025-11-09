import { translations } from './utils/translations';


export interface Skill {
  id: number;
  name: string;
}

export interface UserSkill extends Skill {
  proficiency: 1 | 2 | 3; // 1: Beginner, 2: Intermediate, 3: Expert
}

export interface SessionProposal {
  proposerId: number;
  date: string; // ISO date string
  status: 'pending';
}

export interface Match {
  userId: number;
  status: 'not-started' | 'in-progress' | 'completed';
  scheduledSession?: string; // ISO date string
  sessionProposal?: SessionProposal;
  rating?: number; // Rating given by the user for this swap (1-5)
}

export interface User {
  id: number;
  name: string;
  avatar: string;
  bio: string;
  skillsToTeach: UserSkill[];
  skillsToLearn: Skill[];
  matches: Match[]; // Array of Match objects
  status: 'online' | 'offline';
  level: number;
  xp: number;
  badges: string[];
  streak: number;
  verifiedSkills: number[]; // Array of skill IDs
  linkedinUrl?: string;
  isAdmin?: boolean;
  teacherRating?: number; // Average rating as a teacher
  totalRatings?: number; // Total number of ratings received
}

export interface Message {
    id: number;
    senderId: number;
    receiverId: number;
    text: string;
    timestamp: string;
    reaction?: string; // e.g., '👍'
    isSystemMessage?: boolean;
}

export interface Post {
    id: number;
    authorId: number;
    thumbnailUrl: string;
    caption: string;
    likes: number;
    comments: number;
}

export interface Product {
    id: number;
    name: string;
    imageUrl: string;
    price: string;
    skillId: number;
    amazonUrl?: string;
}

export interface SkillSuggestion {
  skill: string;
  reason: string;
}

export interface ManualCalendarEvent {
  id: number;
  title: string;
  date: string; // ISO String
}

export type TTranslations = typeof translations;
export type TFunction = (key: keyof TTranslations['en'], replacements?: Record<string, string | number>) => string;
