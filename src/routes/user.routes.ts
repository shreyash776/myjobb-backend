import { Router } from 'express';
import { signup, verifyOtp, resendOtp,logout } from '../controllers/user.controller';

const router = Router();

router.post('/signup', signup);
router.post('/verify-otp', verifyOtp);
router.post('/resend-otp', resendOtp);
router.post("/logout", logout);

export default router;
