import { Schema, model, Document, Types } from "mongoose";

export interface IViewLog extends Document {
  userId: Types.ObjectId;
  noteId: Types.ObjectId;
  viewedAt: Date;
  ipAddress: string;
}

const ViewLogSchema = new Schema<IViewLog>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    noteId: {
      type: Schema.Types.ObjectId,
      ref: "Note",
      required: true,
    },
    viewedAt: { type: Date, default: Date.now },
    ipAddress: { type: String, required: true },
  },
  {
    timestamps: false,
  }
);

export const ViewLogModel = model<IViewLog>("ViewLog", ViewLogSchema);
