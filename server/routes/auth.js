import express from 'express';
import { handleRegister, verifyOTP, resendOTP, handleLogin, handleRefreshToken, handleLogout } from '../controllers/authController.js';

const router = express.Router();

router.post('/register', handleRegister);
router.post('/verify-otp', verifyOTP);
router.post('/resend-otp', resendOTP);
router.post('/login', handleLogin);
router.post('/refresh', handleRefreshToken);
router.get('/logout', handleLogout);

export default router;
