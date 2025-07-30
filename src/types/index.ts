// types/index.ts
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'teacher' | 'student' | 'parent';
  status: 'active' | 'hold';
  password_hash?: string; // Optional since it won't be returned in queries
  createdAt: string;
}


export interface School {
  id: string;
  name: string;
  address: string;
  adminIds: string[];
  createdAt: string;
}

export interface Class {
  id: string;
  name: string;
  gradeLevel: number;
  schoolId: string;
  teacherId: string;
  studentIds: string[];
  subjectIds: string[];
  createdAt: string;
}

export interface Subject {
  id: string;
  name: string;
  description: string;
  gradeLevel: number;
  schoolId: string;
  createdAt: string;
}

export interface Chapter {
  id: string;
  title: string;
  description: string;
  subjectId: string;
  orderIndex: number;
  createdAt: string;
}

export interface Concept {
  id: string;
  title: string;
  description: string;
  chapterId: string;
  orderIndex: number;
  metaTags: {
    subject: string;
    gradeLevel: number;
    taxonomyLevel: string;
    contentSources: string[];
  };
  createdAt: string;
}

export interface ContentIntegration {
  id: string;
  conceptId: string;
  provider: 'youtube' | 'vimeo' | 'lti';
  contentUrl: string;
  fallbackUrl?: string;
  providerConfig: {
    title: string;
    description?: string;
    duration?: number;
    ltiSettings?: {
      consumerKey: string;
      sharedSecret: string;
      launchUrl: string;
    };
  };
  createdAt: string;
}

export interface Assignment {
  id: string;
  conceptId: string;
  teacherId: string;
  classId?: string;
  studentIds: string[];
  dueDate: string;
  instructions: string;
  status: 'active' | 'completed' | 'archived';
  createdAt: string;
}

export interface StudentProgress {
  id: string;
  studentId: string;
  conceptId: string;
  assignmentId?: string;
  status: 'not_started' | 'in_progress' | 'completed';
  timeSpent: number; // in minutes
  lastAccessedAt: string;
  completedAt?: string;
}

export interface AVPlaylist {
  id: string;
  teacherId: string;
  classId: string;
  title: string;
  description: string;
  contentItems: {
    id: string;
    conceptId: string;
    contentIntegrationId: string;
    orderIndex: number;
    duration: number;
  }[];
  scheduledFor: string;
  status: 'draft' | 'scheduled' | 'active' | 'completed';
  createdAt: string;
}