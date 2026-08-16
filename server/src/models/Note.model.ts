import { Schema, model, Document, Types } from "mongoose";

export interface INote extends Document {
  title: string;
  department: Types.ObjectId;
  tags: string[];
  cloudinaryPublicId: string;
  resourceType: string;
  pageCount: number;
  uploadedBy: Types.ObjectId;
  createdAt: Date;
}

const NoteSchema = new Schema<INote>(
  {
    title: { type: String, required: true, trim: true },
    department: {
      type: Schema.Types.ObjectId,
      ref: "Department",
      required: true,
    },
    tags: [{ type: String, trim: true }],
    cloudinaryPublicId: { type: String, required: true, select: false },
    resourceType: { type: String, required: true, default: "raw" },
    pageCount: { type: Number, required: true, min: 1, default: 1 },
    uploadedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

export const NoteModel = model<INote>("Note", NoteSchema);

