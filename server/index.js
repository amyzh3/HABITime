// server/index.js
const express = require('express');
const app = express();
const PORT = 8080;
const cors = require('cors');

// dotenv config
const dotenv =require('dotenv');
dotenv.config();

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

// google access
const { google } = require('googleapis');


// ex route
app.get('/', (req, res) => {
  res.send('backend is running');
});

// start server
app.listen(PORT, () => {
  console.log(`server listening on port ${PORT}`);
});



// HELPERS
async function saveUserTokens(userId, tokens) {
  const userRef = db.collection('users').doc(userId);
  await userRef.set({ tokens }, { merge: true });
}

async function loadTokensFromFirestore(userId) {
  const userRef = db.collection('users').doc(userId);
  const doc = await userRef.get();
  return doc.exists ? doc.data().tokens : null;
}

// async function getCalendarEvents(userId) {
//   const tokens = await loadTokensFromFirestore(userId);
//   if (!tokens) throw new Error('No tokens found for user');

//   const oauth2Client = new google.auth.OAuth2();
//   oauth2Client.setCredentials(tokens);

//   const calendar = google.calendar({ version: 'v3', auth: oauth2Client });
//   const response = await calendar.events.list({
//     calendarId: 'primary',
//     timeMin: new Date().toISOString(),
//     maxResults: 20,
//     singleEvents: true,
//     orderBy: 'startTime',
//   });

//   return response.data.items || [];
// }

async function getCalendarEvents(tokens) {
  // const tokens = await loadTokensFromFirestore(userId);
  if (!tokens) throw new Error('No tokens found for user');

  console.log("In calendar events");

  const oauth2Client = new google.auth.OAuth2();

  oauth2Client.setCredentials(tokens);

  const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

  console.log(calendar.calendarList);

  try {
    const response = await calendar.events.list({
      calendarId: 'primary',
      timeMin: new Date().toISOString(),
      maxResults: 20,
      singleEvents: true,
      orderBy: 'startTime',
    });
    return response.data.items || [];
  } catch (error) {
    console.error('Error fetching calendar events:', error);
    throw error;
  }
}

// add a user to the database: auth (string), age (int), nickname (string)
// targetConcerns (list of strings), improveAreas (list of strings)
app.post('/createuser', async (req, res) => {
  console.log('IN createuser ENDPOINT');
  console.log(req.body);
  try {
    const { code, nickname, age, concerns, habits } = req.body;
    console.log(code);
    console.log(nickname);
    console.log(age);
    console.log(concerns);
    console.log(habits);

    // Exchange authorization code for access + refresh tokens
    console.log('TRYING TO GET TOKENS');
    const oAuth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      'postmessage'
    );

    const { tokens } = await oAuth2Client.getToken(code);
    console.log('OBTAINED TOKENS', tokens);

    const events = await getCalendarEvents(tokens);

    console.log('Events: ', events);

    // Create user document first
    const docRef = await db.collection('users').add({
      code,
      age,
      nickname,
      concerns,
      habits,
      createdAt: new Date()
    });

    // Save user's tokens under their user document
    console.log('saving user tokens');
    await saveUserTokens(docRef.id, tokens);
    console.log('done saving user tokens');

    console.log('Added a new user and stored tokens.');
    res.status(201).send({ message: 'User data and tokens saved', id: docRef.id });

    // TODO: connect with google calendar api
    // store user's events inside the default calendar
    // given the events, target concerns and improvement areas,
    // generate a list of recommendations. 
    // store recommendations under each 

  } catch (error) {
    console.error('Error adding user data:', error);
    res.status(500).send({ error: 'Failed to add user data' });
  }
});

// given auth, modifies list of new target concerns + improvement areas
// generates and stores new recommendations
app.post('/modify-concerns', async (req, res) => {
  try {
    const { userId, targetConcerns, improvementAreas } = req.body;

    // get user from db
    const userRef = db.collection('users').doc(userId);

    // TODO: generate new recommendations based on the new concerns/areas
    // ex: 
    // const newTargetConcerns = generateRecommendations(targetConcerns);
    // const newImprovementAreas = generateRecommendations(improvementAreas)

    // update the user's targetConcerns and improvementAreas
    // await userRef.update({
    //   targetConcerns: newTargetConcerns,
    //   improvementAreas: newImprovementAreas,
    //   updatedAt: new Date()
    // });

    console.log("processing concern modification");



    res.status(200).send({ message: 'User concerns and improvement areas updated!' });
  } catch (error) {
    console.error('Error modifying user data:', error);
    res.status(500).send({ error: 'Failed to modify user data' });
  }
});

// get calendar events
app.get('/calendar/events', async (req, res) => {
  try {
    // assume user's access token is sent from frontend (eg. via auth header or cookie)
    const userAccessToken = req.headers.authorization?.split('Bearer ')[1];

    if (!userAccessToken) {
      return res.status(401).json({ error: 'Access token missing' });
    }

    // Set up OAuth2 client using user's token
    const oauth2Client = new google.auth.OAuth2();
    oauth2Client.setCredentials({ access_token: userAccessToken });

    // Connect to Google Calendar API
    const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

    // Fetch events from primary calendar
    const response = await calendar.events.list({
      calendarId: 'primary',
      timeMin: new Date().toISOString(), // optional: only future events
      maxResults: 20,
      singleEvents: true,
      orderBy: 'startTime',
    });

    const events = response.data.items || [];
    res.json(events);
  } catch (error) {
    console.error('Error fetching calendar events:', error);
    res.status(500).json({ error: 'Failed to fetch calendar events' });
  }
});


// export db if needed in other files
module.exports = { db };
