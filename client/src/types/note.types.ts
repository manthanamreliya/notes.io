export interface Note {
  id: string;
  title: string;
  department: string;
  tags: string[];
  uploadedDate: string;
  fileSize?: string;
  pageCount?: number;
  author?: string;
  pdfUrl?: string;
}

export interface AddNoteFormState {
  title: string;
  department: string;
  tags: string;
  file: File | null;
}

export type AddNoteFormErrors = Partial<Record<keyof AddNoteFormState, string>>;

export interface UploadNoteResponse {
  success: boolean;
  message: string;
  note?: Note;
}

