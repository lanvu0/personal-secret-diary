import { getEntriesByUserId, saveEntryToDatabase, deleteEntryFromDatabase, getEntryByUserId, updateEntryInDatabase } from '../../database.js';
import { Request, Response } from 'express';


async function getDashboardPage(req: Request, res: Response): Promise<void> {
  try {
    const userId = req.session.userId;
  
    // Fetch the user's entries
    const entries = await getEntriesByUserId(userId!);

    res.render('pages/dashboard', {
      userId: req.session.userId,
      entries: entries
    });
    
  } catch (error) {
    console.error("Failed to load dashboard:", error);
    res.status(500).send("Sorry, something went wrong.");
  }
}

async function createEntry(req: Request, res: Response): Promise<void> {
  try {
    const { title, content } = req.body;

    const userId = req.session.userId;

    // Get current date in YYYY-MM-DDTHH:MM:SS.SSSZ string
    const createdAt = new Date().toISOString();

    console.log(`User ${userId} is creating a new entry:`);
    console.log(`Title: ${title}`);
    console.log(`Content: ${content}`);

    // Insert into database
    await saveEntryToDatabase(title, content, userId!, createdAt);

    res.redirect('/dashboard');
  } catch (error) {
    // If savePostToDatabase throws an error, catch it here
    console.error("Failed to create entry:", error);
    res.status(500).send("Sorry, something went wrong."); 
  }
}

async function deleteEntry(req: Request, res: Response): Promise<void> {
  try {
    const entryId = parseInt(req.params.entryid as string);
    const userId = req.session.userId;

    // Delete post matching entryId & userId
    await deleteEntryFromDatabase(entryId, userId!);

    res.redirect('/dashboard');
  } catch (error) {
    console.error("Failed to delete entry:", error);
    res.status(500).send("Sorry, something went wrong."); 
  }
}

async function getEditEntryPage(req: Request, res: Response): Promise<void> {
  try {
    const userId = req.session.userId;
    const entryId = parseInt(req.params.entryid as string);

    // Fetch the specific entry & render an edit-entry.ejs, pre-filled with entry's data;
    const entry = await getEntryByUserId(entryId, userId!);

    res.render('pages/edit-entry', { entry });
  } catch (error) {
    console.error("Failed to get edit entry page:", error);
    res.status(500).send("Sorry, something went wrong."); 
  }
}

async function updateEntry(req: Request, res: Response): Promise<void> {
  try {
    const userId = req.session.userId;
    
    const entryId = parseInt(req.params.entryid as string);

    const { title, content } = req.body;

    await updateEntryInDatabase(entryId, userId!, title, content);

    res.redirect('/dashboard');
  } catch (error) {
    console.error("Failed to update entry:", error);
    res.status(500).send("Sorry, something went wrong."); 
  }
}

export default {
  getDashboardPage,
  createEntry,
  deleteEntry,
  getEditEntryPage,
  updateEntry
}