import mongoose, { Schema, Document, ObjectId } from 'mongoose';

export interface IMedicalFile extends Document {
  _id?: ObjectId;
  userId: string;
  category: string;
  title: string;
  date: string;
  notes?: string;
  mimeType: string;
  createdAt: Date;
  updatedAt: Date;
}

const medicalFileSchema = new Schema<IMedicalFile>(
  {
    userId: { type: String, required: true, index: true },
    category: { type: String, required: true },
    title: { type: String, required: true },
    date: { type: String, required: true },
    notes: { type: String },
    mimeType: { type: String, required: true },
  },
  { timestamps: true }
);

export const MedicalFile = mongoose.model<IMedicalFile>('MedicalFile', medicalFileSchema);
