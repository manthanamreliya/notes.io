import { NoteRepository } from "../repositories/note.repository";
import { DepartmentRepository } from "../repositories/department.repository";
import cloudinary from "../config/cloudinary";
import { ApiError } from "../utils/ApiError";
import { Types } from "mongoose";
import { PassThrough } from "stream";

export interface CreateNoteUploadInput {
  title: string;
  department: string;
  tags?: string[];
  pageCount?: number;
  fileBuffer: Buffer;
}

interface CachedSignedUrl {
  viewUrl: string;
  expiresAt: number;
  cachedUntil: number;
}

export class NoteService {
  private noteRepository: NoteRepository;
  private departmentRepository: DepartmentRepository;

  // Server-side in-memory TTL cache to protect Cloudinary free-tier bandwidth & reduce duplicate ViewLogs
  private signedUrlCache = new Map<string, CachedSignedUrl>();

  constructor() {
    this.noteRepository = new NoteRepository();
    this.departmentRepository = new DepartmentRepository();
  }

  /**
   * Upload note PDF file to Cloudinary as raw authenticated asset & save metadata in MongoDB.
   */
  async uploadNote(input: CreateNoteUploadInput, userId: string): Promise<any> {
    const { title, department, tags, fileBuffer } = input;

    if (!title || typeof title !== "string" || title.trim().length === 0) {
      throw ApiError.badRequest("Note title is required.");
    }

    if (!department || typeof department !== "string" || department.trim().length === 0) {
      throw ApiError.badRequest("Department is required.");
    }

    if (!fileBuffer || fileBuffer.length === 0) {
      throw ApiError.badRequest("PDF file is required.");
    }

    // Resolve or create department
    let departmentDoc;
    if (Types.ObjectId.isValid(department)) {
      departmentDoc = await this.departmentRepository.findById(department);
    }
    if (!departmentDoc) {
      departmentDoc = await this.departmentRepository.findByName(department.trim());
    }
    if (!departmentDoc) {
      departmentDoc = await this.departmentRepository.create({ name: department.trim() });
    }

    // Log actual Cloudinary SDK config being used at runtime (masked API secret)
    const config = cloudinary.config();
    const rawSecret = config.api_secret ? String(config.api_secret) : "";
    const maskedSecret = rawSecret.length > 6
      ? `${rawSecret.slice(0, 3)}***${rawSecret.slice(-3)}`
      : rawSecret
      ? "***"
      : "UNDEFINED";

    if (process.env.NODE_ENV !== "production") {
      console.log("[Cloudinary Upload Runtime Config]", {
        cloud_name: config.cloud_name || "UNDEFINED",
        api_key: config.api_key || "UNDEFINED",
        api_secret: maskedSecret,
      });
    }

    // Upload PDF buffer to Cloudinary using stream piping & explicit 60s timeout
    const uploadResult = await new Promise<any>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          resource_type: "raw",
          type: "authenticated",
          folder: "notes_io_pdfs",
          timeout: 60000,
        },
        (error, result) => {
          if (error) {
            console.error("[Cloudinary Upload Error Object]", error);
            return reject(
              ApiError.internal(
                `Failed to upload document to Cloudinary storage: ${error.message || JSON.stringify(error)}`
              )
            );
          }
          resolve(result);
        }
      );

      const passthrough = new PassThrough();
      passthrough.end(fileBuffer);
      passthrough.pipe(uploadStream);
    });

    const parsedTags = Array.isArray(tags)
      ? tags
      : typeof tags === "string"
      ? (tags as string).split(",").map((t) => t.trim()).filter(Boolean)
      : [];

    // Create note record in MongoDB
    const note = await this.noteRepository.create({
      title: title.trim(),
      department: departmentDoc._id as Types.ObjectId,
      tags: parsedTags,
      cloudinaryPublicId: uploadResult.public_id,
      resourceType: "raw",
      pageCount: input.pageCount || 1,
      uploadedBy: new Types.ObjectId(userId),
    });

    const populatedNote = await this.noteRepository.findById((note._id as any).toString());
    return populatedNote;
  }

  /**
   * List notes with department populated and optional pagination.
   */
  async getAllNotesForAdmin(page?: number, limit?: number): Promise<any[]> {
    const notes = await this.noteRepository.findAll({}, page, limit);
    return notes;
  }

  /**
   * List notes grouped by department for Student view.
   */
  async getAllNotesGroupedByDepartment(): Promise<Record<string, any[]>> {
    const notes = await this.noteRepository.findAll();
    const grouped: Record<string, any[]> = {};

    notes.forEach((note) => {
      const deptName = typeof note.department === "object" && (note.department as any)?.name
        ? (note.department as any).name
        : "General";
      if (!grouped[deptName]) {
        grouped[deptName] = [];
      }
      grouped[deptName].push(note);
    });

    return grouped;
  }

  /**
   * List notes for a specific department with optional pagination.
   */
  async getNotesByDepartment(departmentIdOrName: string, page?: number, limit?: number): Promise<any[]> {
    let deptId = departmentIdOrName;
    if (!Types.ObjectId.isValid(departmentIdOrName)) {
      const dept = await this.departmentRepository.findByName(departmentIdOrName);
      if (dept) {
        deptId = (dept._id as any).toString();
      }
    }

    const notes = await this.noteRepository.findAll({ departmentId: deptId }, page, limit);
    return notes;
  }

  /**
   * Generate short-lived signed Cloudinary URL with server-side TTL caching (2.5 minutes).
   * Prevents redundant Cloudinary SDK calls & duplicate ViewLog entries on rapid re-clicks.
   */
  async generateSignedViewUrl(noteId: string, userId: string, ipAddress: string): Promise<{ viewUrl: string; expiresAt: number }> {
    const cacheKey = `${noteId}:${userId}`;
    const now = Date.now();

    // Check in-memory TTL cache
    const cached = this.signedUrlCache.get(cacheKey);
    if (cached && cached.cachedUntil > now) {
      return {
        viewUrl: cached.viewUrl,
        expiresAt: cached.expiresAt,
      };
    }

    const note = await this.noteRepository.findByIdWithSecret(noteId);
    if (!note) {
      throw ApiError.notFound("Note document not found.");
    }

    // Record user view in ViewLog
    try {
      await this.noteRepository.createViewLog({
        userId: new Types.ObjectId(userId),
        noteId: new Types.ObjectId(noteId),
        ipAddress: ipAddress || "127.0.0.1",
        viewedAt: new Date(),
      });
    } catch (e) {
      if (process.env.NODE_ENV !== "production") {
        console.warn("[ViewLog Warning] Failed to log view:", e);
      }
    }

    // Cloudinary signed URL expiration (5 minutes = 300 seconds)
    const expiresAt = Math.floor(now / 1000) + 300;

    const signedUrl = cloudinary.url(note.cloudinaryPublicId, {
      resource_type: note.resourceType || "raw",
      type: "authenticated",
      sign_url: true,
      expires_at: expiresAt,
      secure: true,
    });

    // Store in cache for 2.5 minutes (150,000 ms)
    this.signedUrlCache.set(cacheKey, {
      viewUrl: signedUrl,
      expiresAt,
      cachedUntil: now + 150000,
    });

    // Cleanup stale entries if cache grows
    if (this.signedUrlCache.size > 500) {
      for (const [k, val] of this.signedUrlCache.entries()) {
        if (val.cachedUntil <= now) {
          this.signedUrlCache.delete(k);
        }
      }
    }

    return {
      viewUrl: signedUrl,
      expiresAt,
    };
  }

  /**
   * Delete note by ID from both MongoDB and Cloudinary storage.
   */
  async deleteNote(noteId: string): Promise<void> {
    const note = await this.noteRepository.findByIdWithSecret(noteId);
    if (!note) {
      throw ApiError.notFound("Note document not found.");
    }

    // Destroy Cloudinary asset
    try {
      await cloudinary.uploader.destroy(note.cloudinaryPublicId, {
        resource_type: note.resourceType || "raw",
        type: "authenticated",
        invalidate: true,
      });
    } catch (error) {
      console.error("[Cloudinary Delete Error] Failed to destroy asset:", error);
    }

    // Delete MongoDB document
    await this.noteRepository.deleteById(noteId);
    
    // Clear cache entries for this note
    for (const key of this.signedUrlCache.keys()) {
      if (key.startsWith(`${noteId}:`)) {
        this.signedUrlCache.delete(key);
      }
    }
  }
}
