import express from 'express';
import { createUsersTable } from './database.ts';
import { fileURLToPath } from 'node:url';
import path from 'path';
import session from 'express-session';
import SQLiteStore from 'connect-sqlite3';



// Routers
import authRouter from './src/routes/authRoutes.ts';
import entryRouter from './src/routes/entryRoutes.ts';
import { isLoggedIn } from './src/middleware/authMiddleware.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = 8000;
const app = express();

// Serve static files (CSS, JS) from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Middleware to parse form data
app.use(express.urlencoded({ extended: false }));

// Set EJS as the view engine
app.set('view engine', 'ejs');

// Set the Views Directory
app.set('views', path.join(__dirname, 'views'));

// Configure express-session with SQLite store
const SQLiteStoreConstructor = SQLiteStore(session);
app.use(
  session({
    store: new SQLiteStoreConstructor({
      db: 'sessions.sqlite3', // Store sessions in a separate SQLite database
      dir: './', // Directory for the session database file
      concurrentDB: 'true', // Allow concurrent DB access
    }) as any,
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

// Middleware to make user session data available to all templates
app.use((req, res, next) => {
  res.locals.isAuthenticated = !!req.session.userId;
  next();
});

// Call database set up once
async function initialiseApp() {
  try {
    await createUsersTable();
    app.listen(PORT, () => console.log(`Server started running on PORT: ${PORT}...`));
  } catch (error) {
    console.error('Failed to initialize app:', error);
    process.exit(1);
  }
}

app.get('/', (req, res) => {
  // Redirect to dashboard if logged in, otherwise to login page
  if (req.session.userId) {
    res.redirect('/dashboard');
  } else {
    res.redirect('/login');
  }
});

app.use(authRouter);

app.use(isLoggedIn, entryRouter);

initialiseApp();