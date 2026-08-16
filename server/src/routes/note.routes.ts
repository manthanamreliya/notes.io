import { Router } from "express";
import { NoteController } from "../controllers/note.controller";
import { authenticate } from "../middleware/auth.middleware";

const noteRouter = Router();
const noteController = new NoteController();

/**
 * GET /api/notes (List notes - authenticated users)
 */
noteRouter.get("/", authenticate, noteController.getNotes);

/**
 * GET /api/notes/department/:departmentId (List notes for department)
 */
noteRouter.get(
  "/department/:departmentId",
  authenticate,
  noteController.getNotesByDepartment
);

/**
 * GET /api/notes/:id/view-url (Generate signed Cloudinary URL + log view - authenticated users)
 */
noteRouter.get(
  "/:id/view-url",
  authenticate,
  noteController.getViewUrl
);

export default noteRouter;
