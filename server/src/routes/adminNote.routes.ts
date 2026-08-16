import { Router } from "express";
import { NoteController } from "../controllers/note.controller";
import { authenticate } from "../middleware/auth.middleware";
import { authorizeRoles } from "../middleware/role.middleware";
import { uploadSinglePdf } from "../middleware/upload.middleware";

const adminNoteRouter = Router();
const noteController = new NoteController();

/**
 * POST /api/admin/notes (Admin upload note)
 */
adminNoteRouter.post(
  "/",
  authenticate,
  authorizeRoles("admin"),
  uploadSinglePdf,
  noteController.createNote
);

/**
 * GET /api/admin/notes (Admin list all notes)
 */
adminNoteRouter.get(
  "/",
  authenticate,
  authorizeRoles("admin"),
  noteController.getAdminNotes
);

/**
 * DELETE /api/admin/notes/:id (Admin delete note)
 */
adminNoteRouter.delete(
  "/:id",
  authenticate,
  authorizeRoles("admin"),
  noteController.deleteNote
);

export default adminNoteRouter;
