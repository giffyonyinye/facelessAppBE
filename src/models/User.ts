import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  email?: string;
  password?: string;
  nickname: string;
  googleId?: string;
  avatar?: string;
}

const UserSchema = new Schema<IUser>({
  email: { type: String, unique: true, sparse: true },
  password: { type: String },
  nickname: { type: String, required: true },
  googleId: { type: String, unique: true, sparse: true },
  avatar: {type: String}
});

export default mongoose.model<IUser>('User', UserSchema); 