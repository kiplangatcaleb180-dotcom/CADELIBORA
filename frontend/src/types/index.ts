export interface User {
  id: string;
  email: string;
  fullName: string;
  role: string;
  avatarUrl?: string;
  title?: string;
  profile?: any;
}

export interface Course {
  id: string;
  title: string;
  slug: string;
  category: string;
  description: string;
  coverImage: string;
  level: string;
  duration: string;
}

export interface ResearchProject {
  id: string;
  title: string;
  slug: string;
  area: string;
  description: string;
  status: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
}
