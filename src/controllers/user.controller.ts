import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import User from '../models/user.model';
import Otp from '../models/otp.model';
import { sendEmail } from '../utils/mailer';
import { generateOtp } from '../utils/otp';

export const signup = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

   
    if (await User.findOne({ email })) {
      return res.status(400).json({ message: 'Email already registered' });
    }

   
    const hashedPassword = await bcrypt.hash(password, 12);

   
    const otp = generateOtp();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); 

  
    await Otp.findOneAndUpdate(
      { email },
      { otp, expiresAt },
      { upsert: true, new: true }
    );

    
    req.app.locals.tempUser = { name, email, password: hashedPassword };

   
    await sendEmail(email, 'Your OTP Code', `Your OTP is: ${otp}`);

    res.status(200).json({ message: 'OTP sent to email' });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

export const verifyOtp = async (req: Request, res: Response) => {
  try {
    const { email, otp } = req.body;

    const otpRecord = await Otp.findOne({ email, otp });
    if (!otpRecord || otpRecord.expiresAt < new Date()) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

   
    if (await User.findOne({ email })) {
      await Otp.deleteOne({ email });
      return res.status(400).json({ message: 'User already verified' });
    }

  
    const tempUser = req.app.locals.tempUser;
    if (!tempUser || tempUser.email !== email) {
      return res.status(400).json({ message: 'User data not found. Please signup again.' });
    }

   
    await User.create({
      name: tempUser.name,
      email: tempUser.email,
      password: tempUser.password,
      isVerified: true
    });

    await Otp.deleteOne({ email });
    delete req.app.locals.tempUser;

    await sendEmail(email, 'Registration Successful', 'Your account has been verified!');

    res.status(201).json({ message: 'User registered and verified successfully' });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

export const resendOtp = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    
    if (await User.findOne({ email })) {
      return res.status(400).json({ message: 'User already verified' });
    }

    const otp = generateOtp();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await Otp.findOneAndUpdate(
      { email },
      { otp, expiresAt },
      { upsert: true, new: true }
    );

    await sendEmail(email, 'Your OTP Code (Resent)', `Your OTP is: ${otp}`);

    res.status(200).json({ message: 'OTP resent to email' });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};
