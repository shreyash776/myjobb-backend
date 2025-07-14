import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import User from '../models/user.model';
import Otp, { IOtp, ITempUser } from '../models/otp.model';
import { sendEmail } from '../utils/mailer';
import { generateOtp } from '../utils/otp';
import React from "react";
import { render } from "@react-email/render";
import OtpEmail from "../emails/OtpEmail";
import WelcomeEmail from "../emails/WelcomeEmail";
const isValidEmail = (email: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const logoUrl = "https://myjobb-backend-74wp.onrender.com/images/logo.png";
export const signup = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required.' });
    }
    if (!isValidEmail(email)) {
      return res.status(400).json({ message: 'Invalid email format.' });
    }

   
    if (await User.findOne({ email })) {
      return res.status(400).json({ message: 'Email already registered.' });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    
    const otp = generateOtp();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); 

    
    await Otp.findOneAndUpdate(
      { email },
      {
        otp,
        expiresAt,
        tempUser: { name, email, password: hashedPassword }
      },
      { upsert: true, new: true }
    );

    
    const emailHtml =await render(<OtpEmail name={name} otp={otp} />);
await sendEmail(email, "Your OTP Code", emailHtml);

    res.status(200).json({ message: 'OTP sent to email.' });
  } catch (err: any) {
    console.error('Signup error:', err);
    res.status(500).json({ message: 'Internal server error.' });
  }
};


export const verifyOtp = async (req: Request, res: Response) => {
  try {
    const { email, otp } = req.body;

   
    if (!email || !otp) {
      return res.status(400).json({ message: 'Email and OTP are required.' });
    }
    if (!isValidEmail(email)) {
      return res.status(400).json({ message: 'Invalid email format.' });
    }

    
    const otpRecord = await Otp.findOne({ email, otp }) as IOtp | null;
    if (!otpRecord) {
      return res.status(400).json({ message: 'Invalid OTP or email.' });
    }
    if (otpRecord.expiresAt < new Date()) {
      await Otp.deleteOne({ email, otp });
      return res.status(400).json({ message: 'OTP expired. Please request a new one.' });
    }

    
    if (await User.findOne({ email })) {
      await Otp.deleteOne({ email, otp });
      return res.status(400).json({ message: 'User already verified.' });
    }

    
    const tempUser = otpRecord.tempUser as ITempUser | undefined;
    if (!tempUser) {
      await Otp.deleteOne({ email, otp });
      return res.status(400).json({ message: 'User data not found. Please sign up again.' });
    }

  
    await User.create({
      name: tempUser.name,
      email: tempUser.email,
      password: tempUser.password,
      isVerified: true
    });

   
    await Otp.deleteOne({ email, otp });

   
    const welcomeHtml = await render(<WelcomeEmail name={tempUser.name} logoUrl={logoUrl} />);
await sendEmail(email, 'Welcome to MyJobb!', welcomeHtml);

    res.status(201).json({ message: 'User registered and verified successfully.' });
  } catch (err: any) {
    console.error('Verify OTP error:', err);
    res.status(500).json({ message: 'Internal server error.' });
  }
};


export const resendOtp = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

   
    if (!email) {
      return res.status(400).json({ message: 'Email is required.' });
    }
    if (!isValidEmail(email)) {
      return res.status(400).json({ message: 'Invalid email format.' });
    }

    
    if (await User.findOne({ email })) {
      return res.status(400).json({ message: 'User already verified.' });
    }

   
    const otpRecord = await Otp.findOne({ email }) as IOtp | null;
    if (!otpRecord || !otpRecord.tempUser) {
      return res.status(400).json({ message: 'No signup in progress. Please sign up first.' });
    }

    
    const otp = generateOtp();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

   
    otpRecord.otp = otp;
    otpRecord.expiresAt = expiresAt;
    await otpRecord.save();

  
    await sendEmail(email, 'Your OTP Code (Resent)', `Your new OTP is: ${otp}`);

    res.status(200).json({ message: 'OTP resent to email.' });
  } catch (err: any) {
    console.error('Resend OTP error:', err);
    res.status(500).json({ message: 'Internal server error.' });
  }
};
