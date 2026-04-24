import mongoose, { Schema, Document, ObjectId } from 'mongoose';

export interface IAllergy extends Document {
  _id?: ObjectId;
  userId: string;
  allergen: string;
  severity: 'mild' | 'moderate' | 'severe';
  reaction: string;
  dateDiscovered: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const allergySchema = new Schema<IAllergy>(
  {
    userId: { type: String, required: true, index: true },
    allergen: { type: String, required: true },
    severity: { type: String, enum: ['mild', 'moderate', 'severe'], required: true },
    reaction: { type: String, required: true },
    dateDiscovered: { type: String, required: true },
    notes: { type: String },
  },
  { timestamps: true }
);

export const Allergy = mongoose.model<IAllergy>('Allergy', allergySchema);
