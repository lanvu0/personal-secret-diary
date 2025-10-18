import sqlite3 from 'sqlite3';
import { open, Database } from 'sqlite'
import bcrypt from 'bcryptjs';

export interface DiaryEntry {
  id: number;
  title: string;
  content: string;
  created_at: string; // ISO date string
  user_id: number;
}

let dbInstance: Database | null = null;

async function getDb(): Promise<Database> {
  if (!dbInstance) {
    dbInstance = await open({
      filename: './diary.sqlite3',
      driver: sqlite3.Database
    });
  }
  return dbInstance;
}

export async function createUsersTable() {
  const db = await getDb();

  // Enable foreign key support
  await db.run('PRAGMA foreign_keys = ON;');

  // Users table: id, email, password (hashed)
  await db.run(`
    CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE,
    password TEXT
    );
  `);

  await db.run(`
    CREATE TABLE IF NOT EXISTS entries (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT,
    content TEXT,
    created_at DATETIME,
    user_id INTEGER,
    FOREIGN KEY (user_id) REFERENCES users(id)
    );
  `);
}

export async function saveUserToDatabase(email: string, hashedPassword: string) {
  const db = await getDb();
  await db.run('INSERT INTO users (email, password) VALUES (?, ?)', [email, hashedPassword]);
}

export async function checkUserExists(email: string): Promise<boolean> {
  const db = await getDb();
  const user = await db.get('SELECT 1 FROM users WHERE email = ?', [email]);

  // Cast value to boolean: true if exists, false otherwise
  return !!user;
}

export async function checkUserPassword(email: string, password: string): Promise<boolean> {
  try {
    const db = await getDb();
    // Function only gets called if user with email exists
    const user = await db.get('SELECT password FROM users WHERE email = ?', [email]);
    if (!user) {
      // User does not exist
      return false;
    }
    
    const { password: hashedPassword } = user;
    const result = await bcrypt.compare(password, hashedPassword);

    return result;
  } catch (error) {      
    console.error('Error checking user password:', error);
    throw error;
  }
}

export async function getUserId(email: string): Promise<number | undefined> {
  try {
    const db = await getDb();
    // Use a specific type for the row we expect back
    const userRow = await db.get<{ id: number }>('SELECT id FROM users WHERE email = ?', [email]);
    
    // Return the id if the user was found, otherwise return undefined
    return userRow?.id; 
  } catch (error) {
    console.error('Error getting userId:', error);
    throw error;
  }
}

export async function saveEntryToDatabase(title: string, content: string, userId: number, createdAt: string) {
  try {
    const db = await getDb();
    await db.run('INSERT INTO entries (title, content, user_id, created_at) VALUES (?, ?, ?, ?)', [title, content, userId, createdAt]);

  } catch (error) {
    console.error('Error saving post to database', error);
    throw error;
  }
}

export async function getEntriesByUserId(userId: number): Promise<DiaryEntry[]> {
  try {
    const db = await getDb();
    const entries = await db.all<DiaryEntry[]>('SELECT id, title, content, created_at, user_id FROM entries WHERE user_id = ? ORDER BY created_at DESC', [userId]);

    return entries;
  } catch (error) {
    console.error('Error fetching entries', error);
    throw error;
  }
}

export async function deleteEntryFromDatabase(entryId: number, userId: number) {
  try {
    const db = await getDb();
    await db.run('DELETE FROM entries WHERE id = ? AND user_id = ?', [entryId, userId]);
  } catch (error) {
    console.error('Error deleting entry', error);
    throw error;
  }
}

export async function getEntryByUserId(entryId: number, userId: number): Promise<DiaryEntry | undefined> {
  try {
    const db = await getDb();
    const entry = await db.get<DiaryEntry>('SELECT id, title, content, created_at FROM entries WHERE id = ? AND user_id = ?', [entryId, userId]);

    return entry;
  } catch (error) {
    console.error('Error fetching entry', error);
    throw error;
  }
}

export async function updateEntryInDatabase(entryId: number, userId: number, title: string, content: string) {
  try {
    const db = await getDb();

    const result = await db.run('UPDATE entries SET title = ?, content = ? WHERE id = ? AND user_id = ?', [title, content, entryId, userId]);

    if (result.changes === 0) {
      throw new Error("Entry not found or user not authorized to perform update.");
    }
  } catch (error) {
    console.error('Error fetching entry', error);
    throw error;
  }
}