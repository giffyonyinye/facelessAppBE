import mongoose, { Document, Schema, Types } from 'mongoose';

export interface ISession extends Document {
  token: string;
  nickname: string;
  user?: Types.ObjectId;
}

const SessionSchema = new Schema<ISession>({
  token: { type: String, required: true, unique: true },
  nickname: { type: String, required: true },
  user: { type: Schema.Types.ObjectId, ref: 'User' },
});

export default mongoose.model<ISession>('Session', SessionSchema); 