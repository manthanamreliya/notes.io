import { Request, Response, NextFunction } from "express";
import { NoteService } from "../services/note.service";
import { ApiResponse } from "../utils/ApiResponse";
import { ApiError } from "../utils/ApiError";

export class NoteController {
  private noteService: NoteService;

  constructor() {
    this.noteService = new NoteService();
  }

  /**
   * POST /api/admin/notes
   * Upload note PDF file (Admin only).
   */
  public createNote = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      if (!req.user?.userId) {
        throw ApiError.unauthorized("Authentication required.");
      }

      const file = req.file;
      if (!file) {
        throw ApiError.badRequest("PDF file is required.");
      }

      if (file.mimetype !== "application/pdf" && !file.originalname.toLowerCase().endsWith(".pdf")) {
        throw ApiError.badRequest("Only PDF files (.pdf) are allowed.");
      }

      const { title, department, tags, pageCount } = req.body;
      if (!title || typeof title !== "string" || title.trim().length === 0) {
        throw ApiError.badRequest("Title is required.");
      }

      if (!department || typeof department !== "string" || department.trim().length === 0) {
        throw ApiError.badRequest("Department is required.");
      }

      const note = await this.noteService.uploadNote(
        {
          title: title.trim(),
          department: department.trim(),
          tags: tags ? (Array.isArray(tags) ? tags : [tags]) : [],
          pageCount: pageCount ? Number(pageCount) : 1,
          fileBuffer: file.buffer,
        },
        req.user.userId
      );

      ApiResponse.success(res, 201, "Note published successfully", note);
    } catch (error) {
      next(error);
    }
  };

  /**
   * GET /api/admin/notes
   * List all notes with department populated and optional pagination (Admin only).
   */
  public getAdminNotes = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const page = req.query.page ? Number(req.query.page) : undefined;
      const limit = req.query.limit ? Number(req.query.limit) : undefined;
      const notes = await this.noteService.getAllNotesForAdmin(page, limit);
      ApiResponse.success(res, 200, "Admin notes retrieved successfully", notes);
    } catch (error) {
      next(error);
    }
  };

  /**
   * DELETE /api/admin/notes/:id
   * Delete note document and Cloudinary asset (Admin only).
   */
  public deleteNote = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { id } = req.params;
      if (!id) {
        throw ApiError.badRequest("Note ID parameter is required.");
      }

      await this.noteService.deleteNote(id);
      ApiResponse.success(res, 200, "Note deleted successfully");
    } catch (error) {
      next(error);
    }
  };

  /**
   * GET /api/notes
   * List all notes (Public metadata to any authenticated user).
   */
  public getNotes = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const page = req.query.page ? Number(req.query.page) : undefined;
      const limit = req.query.limit ? Number(req.query.limit) : undefined;
      const notes = await this.noteService.getAllNotesForAdmin(page, limit);
      ApiResponse.success(res, 200, "Notes retrieved successfully", notes);
    } catch (error) {
      next(error);
    }
  };

  /**
   * GET /api/notes/department/:departmentId
   * List notes for a specific department.
   */
  public getNotesByDepartment = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { departmentId } = req.params;
      const page = req.query.page ? Number(req.query.page) : undefined;
      const limit = req.query.limit ? Number(req.query.limit) : undefined;
      const notes = await this.noteService.getNotesByDepartment(departmentId, page, limit);
      ApiResponse.success(res, 200, "Department notes retrieved successfully", notes);
    } catch (error) {
      next(error);
    }
  };

  /**
   * GET /api/notes/:id/view-url
   * Generate short-lived signed Cloudinary URL and record view log.
   */
  public getViewUrl = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      if (!req.user?.userId) {
        throw ApiError.unauthorized("Authentication required.");
      }

      const { id } = req.params;
      const ipAddress = (req.headers["x-forwarded-for"] as string) || req.socket.remoteAddress || "127.0.0.1";

      const result = await this.noteService.generateSignedViewUrl(id, req.user.userId, ipAddress);
      ApiResponse.success(res, 200, "Signed view URL generated successfully", result);
    } catch (error) {
      next(error);
    }
  };
}
