import express from 'express';
import entryController from '../controllers/entryController.js'
import { isLoggedIn } from '../middleware/authMiddleware.js';

const router = express.Router()

router.get('/', isLoggedIn, entryController.getDashboardPage);


export default router;