import express from 'express';
import authController from '../controllers/authController.ts';

// Create a new router instance
const router = express.Router();

router.get('/register', authController.getRegisterPage);
router.post('/register', authController.registerUser);
router.get('/login', authController.getLoginPage);
router.post('/login', authController.loginUser);
router.post('/logout', authController.logoutUser);

export default router;