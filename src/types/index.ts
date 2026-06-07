export interface User {
  id: string;
  nickname: string;
  avatar: string;
  role: 'user' | 'moderator';
  city: string;
}

export interface Experience {
  id: string;
  userId: string;
  title: string;
  content: string;
  diseaseStage: '初诊' | '治疗中' | '康复期';
  medicationExperience: string;
  reviewCity: string;
  tags: string[];
  status: 'published' | 'pending' | 'rejected';
  sensitiveFlags: string[];
  createdAt: string;
  likes: number;
  comments: number;
  views: number;
}

export interface Guide {
  id: string;
  title: string;
  description: string;
  coverImage: string;
  curatorId: string;
  entries: GuideEntry[];
  createdAt: string;
  views: number;
}

export interface GuideEntry {
  id: string;
  experienceId: string;
  orderIndex: number;
  sectionTitle: string;
  experience?: Experience;
}

export interface Comment {
  id: string;
  experienceId: string;
  userId: string;
  content: string;
  status: 'published' | 'pending';
  createdAt: string;
}

export interface SensitiveResult {
  hasSensitive: boolean;
  flags: string[];
  matchedWords: string[];
}

export interface FilterState {
  diseaseStage: string[];
  medicationExperience: string[];
  reviewCity: string[];
}
