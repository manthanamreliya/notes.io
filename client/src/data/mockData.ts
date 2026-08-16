import { Note, UploadNoteResponse } from '../types/note.types';
import { AdminUser, AdminStats } from '../types/admin.types';
import { UserRole } from '../types/auth.types';

/**
 * TEMP: Placeholder demo user state with active role.
 * Role can be set to 'student' or 'admin' directly here or passed via auth context once real login is implemented.
 */
export const DEMO_USER: { username: string; email: string; role: UserRole } = {
  username: "manthanpa",
  email: "manthan123@notes.io",
  role: "student", // hardcode to "student" or "admin" to test dashboard view
};

/**
 * Default departments seed list.
 */
export const initialDepartments: string[] = [
  'Computer Science',
  'Mechanical Engineering',
  'Electrical Engineering',
  'Chemical Engineering',
  'Civil Engineering',
];

/**
 * Placeholder mock notes array.
 * TODO: Replace with real API call (GET /api/notes).
 */
export const mockNotes: Note[] = [
  {
    id: 'note-1',
    title: 'Data Structures & Algorithms Cheat Sheet',
    department: 'Computer Science',
    tags: ['DSA', 'Arrays', 'Trees', 'Graphs'],
    uploadedDate: '2026-08-01',
    fileSize: '2.4 MB',
    pageCount: 14,
    author: 'Prof. Alex Turner',
  },
  {
    id: 'note-2',
    title: 'Thermodynamics & Heat Transfer Fundamentals',
    department: 'Mechanical Engineering',
    tags: ['Entropy', 'Enthalpy', 'Laws'],
    uploadedDate: '2026-08-03',
    fileSize: '3.1 MB',
    pageCount: 22,
    author: 'Dr. Sarah Connor',
  },
  {
    id: 'note-3',
    title: 'Digital Signal Processing Notes',
    department: 'Electrical Engineering',
    tags: ['FFT', 'Filters', 'Signals'],
    uploadedDate: '2026-08-04',
    fileSize: '1.8 MB',
    pageCount: 18,
    author: 'Prof. David Miller',
  },
  {
    id: 'note-4',
    title: 'Organic Chemistry Reactions Summary',
    department: 'Chemical Engineering',
    tags: ['Reactions', 'Synthesis', 'Mechanisms'],
    uploadedDate: '2026-08-05',
    fileSize: '4.5 MB',
    pageCount: 30,
    author: 'Dr. Elena Rostova',
  },
  {
    id: 'note-5',
    title: 'Database Management Systems & SQL Indexing',
    department: 'Computer Science',
    tags: ['SQL', 'Indexes', 'ACID', 'Transactions'],
    uploadedDate: '2026-08-06',
    fileSize: '2.9 MB',
    pageCount: 16,
    author: 'Prof. Alex Turner',
  },
  {
    id: 'note-6',
    title: 'Structural Mechanics & Stress Analysis',
    department: 'Civil Engineering',
    tags: ['Beams', 'Stress', 'Strain'],
    uploadedDate: '2026-08-07',
    fileSize: '5.2 MB',
    pageCount: 25,
    author: 'Dr. Marcus Vance',
  },
];

/**
 * Placeholder mock users array.
 * TODO: Replace with real API call (GET /api/admin/users).
 */
export const mockUsers: AdminUser[] = [
  {
    id: 'usr-1',
    name: 'Manthan Patel',
    email: 'manthan123@notes.io',
    mobileNumber: '9998887770',
    role: 'admin',
    joinedDate: '2026-07-15',
  },
  {
    id: 'usr-2',
    name: 'Aarav Sharma',
    email: 'aarav.sharma@example.com',
    mobileNumber: '9876543211',
    role: 'student',
    joinedDate: '2026-07-20',
  },
  {
    id: 'usr-3',
    name: 'Sophia Chen',
    email: 'sophia.chen@example.com',
    mobileNumber: '9876543212',
    role: 'student',
    joinedDate: '2026-07-22',
  },
  {
    id: 'usr-4',
    name: 'Ethan Johnson',
    email: 'ethan.j@example.com',
    mobileNumber: '9876543213',
    role: 'student',
    joinedDate: '2026-07-29',
  },
  {
    id: 'usr-5',
    name: 'Maya Lin',
    email: 'maya.lin@example.com',
    mobileNumber: '9876543214',
    role: 'admin',
    joinedDate: '2026-08-02',
  },
];

/**
 * Helper to generate department stats breakdown from notes list.
 */
export const computeStats = (notes: Note[], users: AdminUser[], departmentsList: string[] = []): AdminStats => {
  const countsByDept: Record<string, number> = {};
  
  // Initialize counts for explicitly managed departments
  departmentsList.forEach((dept) => {
    countsByDept[dept] = 0;
  });

  // Count notes per department
  notes.forEach((n) => {
    countsByDept[n.department] = (countsByDept[n.department] || 0) + 1;
  });

  const departmentBreakdown = Object.entries(countsByDept).map(([department, count]) => ({
    department,
    count,
  }));

  return {
    totalNotes: notes.length,
    totalUsers: users.length,
    departmentBreakdown,
  };
};

/**
 * Stub async function for uploading notes.
 * TODO: Wire up real API endpoint POST /api/admin/notes with multipart/form-data.
 */
export async function uploadNote(formData: {
  title: string;
  department: string;
  tags: string;
  file: File;
}): Promise<UploadNoteResponse> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 800));

  console.log('[API Stub] uploadNote called with:', {
    title: formData.title,
    department: formData.department,
    tags: formData.tags,
    fileName: formData.file.name,
    fileSize: `${(formData.file.size / (1024 * 1024)).toFixed(2)} MB`,
  });

  const createdNote: Note = {
    id: `note-${Date.now()}`,
    title: formData.title.trim(),
    department: formData.department.trim(),
    tags: formData.tags
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean),
    uploadedDate: new Date().toISOString().split('T')[0],
    fileSize: `${(formData.file.size / (1024 * 1024)).toFixed(1)} MB`,
    pageCount: Math.floor(Math.random() * 20) + 5,
    author: DEMO_USER.username,
  };

  return {
    success: true,
    message: 'Note published successfully',
    note: createdNote,
  };
}

/**
 * Stub async function for deleting notes.
 * TODO: Wire up real API endpoint DELETE /api/admin/notes/:id.
 */
export async function deleteNote(noteId: string): Promise<{ success: boolean; message: string }> {
  await new Promise((resolve) => setTimeout(resolve, 500));
  console.log('[API Stub] deleteNote called for note ID:', noteId);
  return {
    success: true,
    message: `Note ${noteId} deleted successfully`,
  };
}

