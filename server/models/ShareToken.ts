import mongoose, { Schema, Document, ObjectId } from 'mongoose';

export interface IShareToken extends Document {
  _id?: ObjectId;
  userId: string;
  token: string;
  enabled: boolean;
  expiresAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

const shareTokenSchema = new Schema<IShareToken>(
  {
    userId: { type: String, required: true, ref: 'User' },
    token: { type: String, required: true, unique: true, index: true },
    enabled: { type: Boolean, default: false },
    expiresAt: { type: Date, default: null },
  },
  { timestamps: true }
);

export const ShareToken = mongoose.model<IShareToken>('ShareToken', shareTokenSchema);
