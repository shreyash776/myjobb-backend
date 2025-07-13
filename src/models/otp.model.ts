import { Schema, model, Document } from 'mongoose';

export interface ITempUser {
  name: string;
  email: string;
  password: string;
}

export interface IOtp extends Document {
  email: string;
  otp: string;
  expiresAt: Date;
  tempUser?: ITempUser;
}

const otpSchema = new Schema<IOtp>({
  email: { type: String, required: true },
  otp: { type: String, required: true },
  expiresAt: { type: Date, required: true },
  tempUser: {
    name: String,
    email: String,
    password: String
  }
});

export default model<IOtp>('Otp', otpSchema);
