import express from 'express'

const PORT = 8000;
const app = express();


app.get('/', (req, res) => {
  res.send('I am a server');
});


app.listen(PORT, () => console.log(`Server started running on PORT: ${PORT}...`));

