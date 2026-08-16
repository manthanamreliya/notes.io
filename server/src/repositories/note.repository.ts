import { NoteModel, INote } from "../models/Note.model";
import { ViewLogModel, IViewLog } from "../models/ViewLog.model";

export class NoteRepository {
  /**
   * Create a new note record.
   */
  async create(noteData: Partial<INote>): Promise<INote> {
    const note = new NoteModel(noteData);
    return note.save();
  }

  /**
   * Find a note by ID with populated department and uploadedBy references (public metadata).
   */
  async findById(id: string): Promise<INote | null> {
    return NoteModel.findById(id)
      .populate("department", "name")
      .populate("uploadedBy", "name email role")
      .exec();
  }

  /**
   * Find a note by ID explicitly including hidden fields (cloudinaryPublicId & resourceType).
   */
  async findByIdWithSecret(id: string): Promise<INote | null> {
    return NoteModel.findById(id)
      .select("+cloudinaryPublicId")
      .populate("department", "name")
      .populate("uploadedBy", "name email role")
      .exec();
  }

  /**
   * Query notes with optional filtering and pagination.
   */
  async findAll(
    filter: { departmentId?: string; tag?: string } = {},
    page?: number,
    limit?: number
  ): Promise<INote[]> {
    const query: Record<string, unknown> = {};
    if (filter.departmentId) {
      query.department = filter.departmentId;
    }
    if (filter.tag) {
      query.tags = filter.tag;
    }

    let mongooseQuery = NoteModel.find(query)
      .populate("department", "name")
      .populate("uploadedBy", "name email")
      .sort({ createdAt: -1 });

    if (page && limit && page > 0 && limit > 0) {
      const skip = (page - 1) * limit;
      mongooseQuery = mongooseQuery.skip(skip).limit(limit);
    }

    return mongooseQuery.exec();
  }

  /**
   * Count total notes matching query.
   */
  async count(filter: { departmentId?: string; tag?: string } = {}): Promise<number> {
    const query: Record<string, unknown> = {};
    if (filter.departmentId) {
      query.department = filter.departmentId;
    }
    if (filter.tag) {
      query.tags = filter.tag;
    }
    return NoteModel.countDocuments(query).exec();
  }

  /**
   * Delete note by ID.
   */
  async deleteById(id: string): Promise<INote | null> {
    return NoteModel.findByIdAndDelete(id).exec();
  }

  /**
   * Record a note view in ViewLog collection.
   */
  async createViewLog(viewData: Partial<IViewLog>): Promise<IViewLog> {
    const log = new ViewLogModel(viewData);
    return log.save();
  }
}
