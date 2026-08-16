export interface CreateNoteDTO {
  title: string;
  departmentId: string;
  tags?: string[];
  cloudinaryPublicId: string;
  resourceType?: string;
  pageCount?: number;
}

export interface NoteResponseDTO {
  id: string;
  title: string;
  department: any;
  tags: string[];
  pageCount: number;
  uploadedBy: any;
  createdAt: Date;
  // Note: cloudinaryPublicId is intentionally omitted from public response payloads
}

