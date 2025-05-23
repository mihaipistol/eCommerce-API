import { Router } from 'express';
import Zod from 'zod';
import { PASSWORD_MIN_LENGTH } from '../../lib/constants';
import {
  validateRefreshToken,
  validateToken,
} from '../../middleware/authorization';
import { validateData } from '../../middleware/validation';
import { UserRole } from '../../types';
import { login, logout, refreshToken } from './controller';

const schemaLogin = Zod.object({
  email: Zod.string().email(),
  password: Zod.string().min(PASSWORD_MIN_LENGTH),
});

const schemaRefresh = Zod.object({
  id: Zod.string(),
});

const router = Router();

router.post('/login', validateData(schemaLogin), login);
// router.post('/reset-password', validateData(schemaLogin), resetPassword);
// router.post('/verify-email', validateData(schemaLogin), verifyEmail);
// router.post('/resend-email', validateData(schemaLogin), resendEmail);
// router.post('/verify-otp', validateData(schemaLogin), verifyOtp);
// router.post('/resend-otp', validateData(schemaLogin), resendOtp);
router.post('/logout', validateToken(UserRole.USER), logout);
router.post('/refresh-token', validateRefreshToken, refreshToken);

export default router;
