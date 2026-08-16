import { Schema, model, Document } from "mongoose";

export interface IDepartment extends Document {
  name: string;
  createdAt: Date;
}

const DepartmentSchema = new Schema<IDepartment>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

export const DepartmentModel = model<IDepartment>(
  "Department",
  DepartmentSchema
);
