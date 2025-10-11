import express from 'express';
import { createUsersTable } from './database.js';
import authRouter from './src/routes/authRoutes.js';
import { fileUrlToPath } from 'node:url';

const __filename = fileUrlToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = 8000;
const app = express();

// Middleware to parse form data
app.use(express.urlencoded({ extended: false }));

// Set EJS as the view engine
app.set('view engine', 'ejs');

// Set the Views Directory
app.set('views', path.join(__dirname, 'views'));

// Call database set up once
createUsersTable();

app.get('/', (req, res) => {
  res.send('Hello, Diary!');
});

app.use(authRouter);

app.listen(PORT, () => console.log(`Server started running on PORT: ${PORT}...`));

