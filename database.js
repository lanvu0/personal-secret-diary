import sqlite3 from 'sqlite3';
import { open } from 'sqlite'

export async function createUsersTable() {
  const db = await open({
    filename: './diary.sqlite3',
    driver: sqlite3.Database
  });

  // Users table: id, email, password (hashed)
  await db.run(`
    CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE,
    password TEXT
    );
  `);

  const result = await db.all('SELECT * FROM users');

  console.log(result);
}