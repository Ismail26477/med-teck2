import mongoose, { Schema, Document, ObjectId } from 'mongoose';

export interface IMedication extends Document {
  _id?: ObjectId;
  userId: string;
  name: string;
  dosage: string;
  frequency: string;
  reason: string;
  startDate: string;
  endDate?: string;
  prescribedBy?: string;
  pharmacy?: string;
  sideEffects?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const medicationSchema = new Schema<IMedication>(
  {
    userId: { type: String, required: true, index: true },
    name: { type: String, required: true },
    dosage: { type: String, required: true },
    frequency: { type: String, required: true },
    reason: { type: String, required: true },
    startDate: { type: String, required: true },
    endDate: { type: String },
    prescribedBy: { type: String },
    pharmacy: { type: String },
    sideEffects: { type: String },
    notes: { type: String },
  },
  { timestamps: true }
);

export const Medication = mongoose.model<IMedication>('Medication', medicationSchema);
