import { Router } from 'express';
import { signup, verifyOtp, resendOtp } from '../controllers/user.controller';

const router = Router();

router.post('/signup', signup);
router.post('/verify-otp', verifyOtp);
router.post('/resend-otp', resendOtp);

export default router;
