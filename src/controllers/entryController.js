import { getAllEntries, saveEntryToDatabase } from '../../database.js';

async function getDashboardPage(req, res) {
  const userId = req.session.userId;

  // Get all entries
  const entryList = await getAllEntries(userId);
  console.log(entryList)

  res.render('pages/dashboard', { userId: req.session.userId, entries: entryList } );
}

async function createEntry(req, res) {
  try {
    const { title, content } = req.body;

    const userId = req.session.userId;

    // Get current date in YYYY-MM-DDTHH:MM:SS.SSSZ string
    const createdAt = new Date().toISOString();

    console.log(`User ${userId} is creating a new entry:`);
    console.log(`Title: ${title}`);
    console.log(`Content: ${content}`);

    // Insert into database
    await saveEntryToDatabase(title, content, userId, createdAt);

    res.redirect('/dashboard');
  } catch (error) {
    // If savePostToDatabase throws an error, catch it here
    console.error("Failed to create entry:", error);
    res.status(500).send("Sorry, something went wrong."); 
  }
}

export default {
  getDashboardPage,
  createEntry
}