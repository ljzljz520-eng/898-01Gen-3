import { create } from 'zustand';
import type { Experience, Guide, Comment, User, FilterState } from '@/types';
import experiencesData from '@/data/experiences.json';
import guidesData from '@/data/guides.json';
import commentsData from '@/data/comments.json';
import usersData from '@/data/users.json';
import { checkSensitiveContent } from '@/utils/sensitiveCheck';

interface ContentState {
  experiences: Experience[];
  guides: Guide[];
  comments: Comment[];
  users: User[];
  currentUser: User;
  filters: FilterState;
  setFilters: (filters: FilterState) => void;
  getFilteredExperiences: () => Experience[];
  getPublishedExperiences: () => Experience[];
  getPendingExperiences: () => Experience[];
  getExperienceById: (id: string) => Experience | undefined;
  getGuideById: (id: string) => Guide | undefined;
  getCommentsByExperienceId: (experienceId: string) => Comment[];
  getUserById: (id: string) => User | undefined;
  addExperience: (experience: Omit<Experience, 'id' | 'createdAt' | 'likes' | 'comments' | 'views' | 'status' | 'sensitiveFlags'>) => { success: boolean; needsReview: boolean; experience: Experience };
  addComment: (experienceId: string, content: string) => Comment;
  approveExperience: (id: string) => void;
  rejectExperience: (id: string) => void;
  toggleLike: (id: string) => void;
  incrementView: (id: string) => void;
}

export const useContentStore = create<ContentState>((set, get) => ({
  experiences: experiencesData as Experience[],
  guides: guidesData as Guide[],
  comments: commentsData as Comment[],
  users: usersData as User[],
  currentUser: usersData[2] as User,
  filters: {
    diseaseStage: [],
    medicationExperience: [],
    reviewCity: []
  },

  setFilters: (filters) => set({ filters }),

  getFilteredExperiences: () => {
    const { experiences, filters } = get();
    const published = experiences.filter(e => e.status === 'published');
    
    return published.filter(exp => {
      if (filters.diseaseStage.length > 0 && !filters.diseaseStage.includes(exp.diseaseStage)) {
        return false;
      }
      if (filters.medicationExperience.length > 0 && !filters.medicationExperience.includes(exp.medicationExperience)) {
        return false;
      }
      if (filters.reviewCity.length > 0 && !filters.reviewCity.includes(exp.reviewCity)) {
        return false;
      }
      return true;
    }).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  getPublishedExperiences: () => {
    return get().experiences
      .filter(e => e.status === 'published')
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  getPendingExperiences: () => {
    return get().experiences
      .filter(e => e.status === 'pending')
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  },

  getExperienceById: (id) => get().experiences.find(e => e.id === id),

  getGuideById: (id) => {
    const guide = get().guides.find(g => g.id === id);
    if (guide) {
      const entriesWithExperience = guide.entries.map(entry => ({
        ...entry,
        experience: get().experiences.find(e => e.id === entry.experienceId)
      }));
      return { ...guide, entries: entriesWithExperience };
    }
    return undefined;
  },

  getCommentsByExperienceId: (experienceId) => {
    return get().comments
      .filter(c => c.experienceId === experienceId && c.status === 'published')
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  getUserById: (id) => get().users.find(u => u.id === id),

  addExperience: (experienceData) => {
    const { currentUser } = get();
    const sensitiveResult = checkSensitiveContent(experienceData.content);
    
    const newExperience: Experience = {
      ...experienceData,
      id: `e${Date.now()}`,
      createdAt: new Date().toISOString(),
      likes: 0,
      comments: 0,
      views: 0,
      status: sensitiveResult.hasSensitive ? 'pending' : 'published',
      sensitiveFlags: sensitiveResult.flags
    };

    set(state => ({
      experiences: [...state.experiences, newExperience]
    }));

    return {
      success: true,
      needsReview: sensitiveResult.hasSensitive,
      experience: newExperience
    };
  },

  addComment: (experienceId, content) => {
    const { currentUser } = get();
    const sensitiveResult = checkSensitiveContent(content);
    
    const newComment: Comment = {
      id: `c${Date.now()}`,
      experienceId,
      userId: currentUser.id,
      content,
      status: sensitiveResult.hasSensitive ? 'pending' : 'published',
      createdAt: new Date().toISOString()
    };

    set(state => ({
      comments: [...state.comments, newComment],
      experiences: state.experiences.map(e => 
        e.id === experienceId 
          ? { ...e, comments: e.comments + (newComment.status === 'published' ? 1 : 0) }
          : e
      )
    }));

    return newComment;
  },

  approveExperience: (id) => {
    set(state => ({
      experiences: state.experiences.map(e =>
        e.id === id ? { ...e, status: 'published' as const } : e
      )
    }));
  },

  rejectExperience: (id) => {
    set(state => ({
      experiences: state.experiences.map(e =>
        e.id === id ? { ...e, status: 'rejected' as const } : e
      )
    }));
  },

  toggleLike: (id) => {
    set(state => ({
      experiences: state.experiences.map(e =>
        e.id === id ? { ...e, likes: e.likes + 1 } : e
      )
    }));
  },

  incrementView: (id) => {
    set(state => ({
      experiences: state.experiences.map(e =>
        e.id === id ? { ...e, views: e.views + 1 } : e
      )
    }));
  }
}));
