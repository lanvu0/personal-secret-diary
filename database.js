import sqlite3 from 'sqlite3';
import { open } from 'sqlite'
import bcrypt from 'bcryptjs';

let dbInstance = null;

async function getDb() {
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

export async function saveUserToDatabase(email, hashedPassword) {
  const db = await getDb();
  await db.run('INSERT INTO users (email, password) VALUES (?, ?)', [email, hashedPassword]);
}

export async function checkUserExists(email) {
  const db = await getDb();
  const user = await db.get('SELECT 1 FROM users WHERE email = ?', [email]);

  // Cast value to boolean: true if exists, false otherwise
  return !!user;
}

export async function checkUserPassword(email, password) {
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

export async function getUserId(email) {
  try {
    const db = await getDb();
    const { id: userId } = await db.get('SELECT id FROM users WHERE email = ?', [email]);
    return userId;
  } catch (error) {
    console.error('Error getting userId:', error);
    throw error;
  }
}

export async function saveEntryToDatabase(title, content, userId, createdAt) {
  try {
    const db = await getDb();
    await db.run('INSERT INTO entries (title, content, user_id, created_at) VALUES (?, ?, ?, ?)', [title, content, userId, createdAt]);

  } catch (error) {
    console.error('Error saving post to database', error);
    throw error;
  }
}

export async function getAllEntries(userId) {
  try {
    const db = await getDb();
    const data = await db.all('SELECT title, content, created_at FROM entries WHERE user_id = ?', userId);

    return data;
  } catch (error) {
    console.error('Error getting all posts from database', error);
    throw error;
  }
}