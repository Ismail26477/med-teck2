import mongoose, { Schema, Document, ObjectId } from 'mongoose';

export interface IMedicalCondition extends Document {
  _id?: ObjectId;
  userId: string;
  name: string;
  status: 'active' | 'resolved';
  diagnosedDate: string;
  diagnosedBy?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const medicalConditionSchema = new Schema<IMedicalCondition>(
  {
    userId: { type: String, required: true, index: true },
    name: { type: String, required: true },
    status: { type: String, enum: ['active', 'resolved'], required: true },
    diagnosedDate: { type: String, required: true },
    diagnosedBy: { type: String },
    notes: { type: String },
  },
  { timestamps: true }
);

export const MedicalCondition = mongoose.model<IMedicalCondition>('MedicalCondition', medicalConditionSchema);
