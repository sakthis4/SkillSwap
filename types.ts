
export interface Skill {
  id: number;
  name: string;
}

export interface User {
  id: number;
  name: string;
  avatar: string;
  bio: string;
  skillsToTeach: Skill[];
  skillsToLearn: Skill[];
  matches: number[]; // Array of user IDs
  status: 'online' | 'offline';
  level: number;
  xp: number;
  badges: string[];
  streak: number;
  linkedinUrl?: string;
}

export interface Message {
    id: number;
    senderId: number;
    receiverId: number;
    text: string;
    timestamp: string;
    reaction?: string; // e.g., '👍'
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
