const express = require('express');
const argon2 = require('argon2');
const fs = require('fs');
const https = require('https');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 3003;

// Configure SSL certificates
const privateKey = fs.readFileSync('localhost.local-key.pem', 'utf8');
const certificate = fs.readFileSync('localhost.local.pem', 'utf8');
const credentials = { key: privateKey, cert: certificate };

// Middleware to parse JSON request bodies
app.use(express.json());

// CORS configuration
app.use(cors({
  origin: true,
  methods: ['POST'],
  allowedHeaders: ['Content-Type'],
  credentials: true,
}));

// Route to handle user registration
app.post('/register', async (req, res) => {
  const { username, password } = req.body;

  try {
    // Generate the hash for the password
    const hash = await argon2.hash(password);

    // Save the username and hashed password to the JSON file
    const user = { username, password: hash };
    const users = getUsersFromFile();
    users.push(user);
    saveUsersToFile(users);

    console.log('User registered:', user);
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Error during registration:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Route to handle user login
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    // Retrieve the user from the JSON file based on the username
    const users = getUsersFromFile();
    const user = users.find((u) => u.username === username);

    if (!user) {
      console.log('Invalid login attempt:', username);
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Verify the password
    if (await argon2.verify(user.password, password)) {
      console.log('Login successful:', username);
      return res.status(200).json({ message: 'Login successful' });
    } else {
      console.log('Invalid login attempt:', username);
      return res.status(401).json({ error: 'Invalid credentials' });
    }
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Helper function to read users from the JSON file
function getUsersFromFile() {
  const filePath = path.join(__dirname, 'users.json');
  console.log('Reading users from file:', filePath);
  try {
    const data = fs.readFileSync(filePath);
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading users file:', error);
    return [];
  }
}

// Helper function to save users to the JSON file
function saveUsersToFile(users) {
  const filePath = path.join(__dirname, 'users.json');
  console.log('Writing users to file:', filePath);
  try {
    const data = JSON.stringify(users, null, 2);
    fs.writeFileSync(filePath, data);
  } catch (error) {
    console.error('Error writing users file:', error);
  }
}

// Create the HTTPS server
const httpsServer = https.createServer(credentials, app);

// Start the server
httpsServer.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


