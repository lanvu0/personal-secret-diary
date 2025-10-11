import sqlite3 from 'sqlite3';
import { open } from 'sqlite'

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