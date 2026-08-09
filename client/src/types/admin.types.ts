import { UserRole } from './auth.types';

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  joinedDate: string;
}

export interface SubjectBreakdown {
  subject: string;
  count: number;
}

export interface AdminStats {
  totalNotes: number;
  totalUsers: number;
  subjectBreakdown: SubjectBreakdown[];
}
