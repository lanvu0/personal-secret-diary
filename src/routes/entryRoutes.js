import express from 'express';
import entryController from '../controllers/entryController.js'
import { isLoggedIn } from '../middleware/authMiddleware.js';

const router = express.Router()

router.get('/dashboard', isLoggedIn, entryController.getDashboardPage);

router.post('/entries', isLoggedIn, entryController.createEntry);


export default router;