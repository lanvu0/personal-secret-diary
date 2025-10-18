import express from 'express';
import { createUsersTable } from './database.js';
import { fileURLToPath } from 'node:url';
import path from 'path';
import session from 'express-session';
import SQLiteStore from 'connect-sqlite3';

// Routers
import authRouter from './src/routes/authRoutes.js';
import entryRouter from './src/routes/entryRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = 8000;
const app = express();

// Middleware to parse form data
app.use(express.urlencoded({ extended: false }));

// Set EJS as the view engine
app.set('view engine', 'ejs');

// Set the Views Directory
app.set('views', path.join(__dirname, 'views'));

// Configure express-session with SQLite store
app.use(
  session({
    store: new (SQLiteStore(session))({
      db: 'sessions.sqlite3', // Store sessions in a separate SQLite database
      dir: './', // Directory for the session database file
      concurrentDB: true, // Allow concurrent DB access
    }),
    secret: process.env.SESSION_SECRET || 'your-secure-secret',
    resave: false, // Don't save session if unmodified
    saveUninitialized: false, // Don't save uninitialised sessions
    cookie: {
      secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
      httpOnly: true, // Prevent client-side access to cookies
      sameSite: 'strict', // Mitigate CSRF attacks
      maxAge: 24 * 60 * 60 * 1000, // 1 day in milliseconds
    },
  })
);

// Call database set up once
await createUsersTable();

app.get('/', (req, res) => {
  res.send('Hello, Diary!');
});

app.use(authRouter);

app.use(entryRouter);


app.listen(PORT, () => console.log(`Server started running on PORT: ${PORT}...`));

