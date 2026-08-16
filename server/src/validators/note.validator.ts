import { CreateNoteDTO } from "../types/dtos/note.dto";

export class NoteValidator {
  /**
   * Validate note upload request body payload.
   */
  public static validateCreateNote(data: unknown): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    const body = data as Partial<CreateNoteDTO>;

    if (!body.title || typeof body.title !== "string" || body.title.trim().length === 0) {
      errors.push("Note title is required.");
    }

    if (!body.departmentId || typeof body.departmentId !== "string") {
      errors.push("Department is required.");
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }
}

