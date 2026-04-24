import mongoose, { Schema, Document, ObjectId } from 'mongoose';

export interface IReport extends Document {
  _id?: ObjectId;
  userId: string;
  title: string;
  type: string;
  date: string;
  doctor?: string;
  clinic?: string;
  description?: string;
  findings?: string;
  recommendations?: string;
  fileUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

const reportSchema = new Schema<IReport>(
  {
    userId: { type: String, required: true, index: true },
    title: { type: String, required: true },
    type: { type: String, required: true },
    date: { type: String, required: true },
    doctor: { type: String },
    clinic: { type: String },
    description: { type: String },
    findings: { type: String },
    recommendations: { type: String },
    fileUrl: { type: String },
  },
  { timestamps: true }
);

export const Report = mongoose.model<IReport>('Report', reportSchema);
