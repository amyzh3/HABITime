// server/index.js
const express = require('express');
const app = express();
const PORT = 8080;
const cors = require('cors');

// firebase-admin for backend
const admin = require("firebase-admin");
const serviceAccount = require("./firebase-service-key.json");

// init Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

// firestore database
const db = admin.firestore();

// middleware
app.use(cors());
app.use(express.json());


// ex route
app.get('/', (req, res) => {
  res.send('backend is running');
});

// start server
app.listen(PORT, () => {
  console.log(`server listening on port ${PORT}`);
});

// add a user to the database
app.post('/adduser', async (req, res) => {
  try {
    const { age, targetConcerns, calendarEvents } = req.body;

    const docRef = await db.collection('userData').add({
      age,
      targetConcerns,
      calendarEvents,
      createdAt: new Date()
    });

    res.status(201).send({ message: 'User data added!', id: docRef.id });
  } catch (error) {
    console.error('Error adding user data:', error);
    res.status(500).send({ error: 'Failed to add user data' });
  }
});

// Export db if needed in other files
module.exports = { db };
