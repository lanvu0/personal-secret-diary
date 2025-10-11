import express from 'express';
import { createUsersTable } from './database.js';

const PORT = 8000;
const app = express();


app.get('/', (req, res) => {
  res.send('Hello, Diary!');

  createUsersTable();
});


app.listen(PORT, () => console.log(`Server started running on PORT: ${PORT}...`));

