import express from 'express';
import entryController from '../controllers/entryController.js'
import { isLoggedIn } from '../middleware/authMiddleware.js';

const router = express.Router()

router.get('/dashboard', isLoggedIn, entryController.getDashboardPage);

router.post('/entries', isLoggedIn, entryController.createEntry);

router.post('/entries/delete/:entryid', isLoggedIn, entryController.deleteEntry);

router.get('/entries/edit/:entryid', isLoggedIn, entryController.getEditEntryPage);

router.post('/entries/update/:entryid', isLoggedIn, entryController.updateEntry)


export default router;