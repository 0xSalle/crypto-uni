const express = require('express');
const argon2 = require('argon2');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Users storage - use a proper database in a production app
const users = [];

app.post('/register', async (req, res) => {
  const { username, password } = req.body;

  const hashedPassword = await argon2.hash(password);

  users.push({ username, password: hashedPassword });

  res.status(200).send({ message: 'User registered' });
});

app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  const user = users.find(user => user.username === username);

  if (!user) {
    return res.status(400).send({ message: 'Invalid username' });
  }

  const validPassword = await argon2.verify(user.password, password);

  if (!validPassword) {
    return res.status(400).send({ message: 'Invalid password' });
  }

  res.status(200).send({ message: 'Login successful' });
});

app.listen(5000, () => {
  console.log('Server is running on port 5000');
});
