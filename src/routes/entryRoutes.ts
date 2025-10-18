import express from 'express';
import entryController from '../controllers/entryController.ts';

const router = express.Router();

router.get('/dashboard', entryController.getDashboardPage);
router.post('/entries', entryController.createEntry);
router.post('/entries/delete/:entryid', entryController.deleteEntry);
router.get('/entries/edit/:entryid', entryController.getEditEntryPage);
router.post('/entries/update/:entryid', entryController.updateEntry);


export default router;