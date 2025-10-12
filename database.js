import sqlite3 from 'sqlite3';
import { open } from 'sqlite'
import bcrypt from 'bcryptjs';
import e from 'express';

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

  // Users table: id, email, password (hashed)
  await db.run(`
    CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE,
    password TEXT
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
  } catch (err) {      
    console.error('Error checking user password:', error);
    throw error;
  }
}

export async function getUserId(email) {
  try {
    const db = await getDb();
    const { id: userId } = await db.get('SELECT id FROM users WHERE email = ?', [email]);
    return userId;
  } catch (err) {
    console.error('Error getting userId:', error);
    throw error;
  }
}