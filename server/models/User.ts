import mongoose, { Schema, Document, ObjectId } from 'mongoose';

export interface IUser extends Document {
  _id?: ObjectId;
  email: string;
  password: string;
  name: string;
  dateOfBirth?: string;
  bloodType?: string;
  emergencyContact?: string;
  emergencyPhone?: string;
  allergies?: string[];
  conditions?: string[];
  medications?: string[];
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
    dateOfBirth: { type: String },
    bloodType: { type: String, enum: ['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'] },
    emergencyContact: { type: String },
    emergencyPhone: { type: String },
    allergies: [String],
    conditions: [String],
    medications: [String],
  },
  { timestamps: true }
);

export const User = mongoose.model<IUser>('User', userSchema);
