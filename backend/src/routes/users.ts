import { Router } from 'express';
import { register, login, getProfile, updateProfile, registerAdmin } from '../controllers/userController';
import { authenticate } from '../middleware/auth';
import { validateUserRegistration, validateUserLogin } from '../middleware/validation';

const router = Router();

router.post('/register', validateUserRegistration, register);
router.post('/login', validateUserLogin, login);
router.post('/register-admin', validateUserRegistration, registerAdmin);
router.get('/profile', authenticate, getProfile);
router.put('/profile', authenticate, updateProfile);

export default router;
