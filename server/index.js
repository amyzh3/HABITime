// server/index.js
const express = require('express');
const app = express();
const PORT = 8080;
const cors = require('cors');

// import Gemini prompt
const { prompt_head, prompt_mid, prompt_tail } = require('./prompts');

// dotenv config
const dotenv =require('dotenv');
dotenv.config();

// firebase-admin for backend
const admin = require("firebase-admin");
const serviceAccount = require("./firebase-service-key.json");

var genAI = null;

// dynamic import genai
async function loadGenAI() {
  const { GoogleGenAI } = await import('@google/genai');
  genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  console.log("@google/genai loaded");
}

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


async function loadTokensFromFirestore(uid) {
  const querySnapshot = await db.collection('users').where('uid', '==', uid).get();

  if (querySnapshot.empty) {
    console.error('No matching document found');
    return null;
  }

  const doc = querySnapshot.docs[0];
  return doc.exists ? doc.data().tokens : null;
}

async function getGeminiRecs(events, concerns, habits) {
  await loadGenAI();

  var prompt = prompt_head;
  
  events.forEach(e => {
    prompt += JSON.stringify(e);
    prompt += '\n';
  });
  
  prompt += prompt_mid;

  prompt += "\nConcerns: "
  concerns.forEach(concern => {
    prompt += concern + ", ";
  });

  prompt += "\nHabits: "
  habits.forEach(habit => {
    prompt += habit + ", ";
  });

  prompt += prompt_tail;

  console.log("Prompt ", prompt);

  try {
    const result = await genAI.models.generateContent({
        model: "gemini-2.0-flash",
        contents: [
            {
                parts: [{ text: prompt }],
            },
        ],
    });

    let text = result.candidates?.[0]?.content?.parts?.[0]?.text || "No response";
    console.log(text);

    if(text == "No response") return [];

    const jsonBlockMatch = text.match(/```json\s*([\s\S]*?)\s*```/);
    
    if (jsonBlockMatch) {
      text = jsonBlockMatch[1]; // extract the inside of the ```json ``` block
    }
    console.log(text);
    return JSON.parse(text);


  } catch (error) {
      console.error(error);
  }
}

async function getCalendarEvents(oauth2Client) {
  // const tokens = await loadTokensFromFirestore(userId);
  if (!oauth2Client) throw new Error('no oauth2client given');

  console.log("In calendar events");

  // const oauth2Client = new google.auth.OAuth2();

  // oauth2Client.setCredentials(tokens);

  const calendar = google.calendar({ version: 'v3', auth: oauth2Client });
  console.log("LOG FOR DEBUGGING");
  // console.log(calendar.calendarList);

  try {
    const response = await calendar.events.list({
      calendarId: 'primary',
      timeMin: new Date().toISOString(),
      maxResults: 20,
      singleEvents: true,
      orderBy: 'startTime',
    });
    const events = response.data.items || [];

    const simplifiedEvents = events.map(event => ({
      title: event.summary || '',
      start: event.start?.dateTime || '',
      end: event.end?.dateTime || '',
      // location: event.location || '',
    }));

    return simplifiedEvents;
  } catch (error) {
    console.error('Error fetching calendar events:', error);
    throw error;
  }
}

// check if user already exists
app.get('/existing-user', async (req, res) => {
  try {
    const { uid } = req.query;
    const usersRef = db.collection('users');
    const querySnapshot = await usersRef.where('uid', '==', uid).get();

    if (!querySnapshot.empty) {
      console.log('User already exists.');
      return res.status(200).send({ message: 'User already exists', id: querySnapshot.docs[0].id });
    } else {
      console.log('User does not exist.');
      return res.status(404).send({ message: 'User not found' });
    }
  } catch (e) {
      console.error('Error checking for existing user:', e);
      res.status(500).send({ error: 'Internal server error' });
  }

});


// authenticate user
app.post('/login', async (req, res) => {
  console.log('IN login ENDPOINT');
  console.log(req.body);

  try {
    const { uid } = req.body; // Get UID from request body

    // Check if UID is provided
    if (!uid) {
      return res.status(400).send({ error: 'UID is required' });
    }

    // Query the database to check if the user already exists by UID
    const userSnapshot = await db.collection('users').where('uid', '==', uid).get();

    // If user exists in the database, return true (they are a logged-in user)
    if (!userSnapshot.empty) {
      console.log('User found in database');
      return res.status(200).send({ exists: true }); // User exists, return true
    }

    // If user doesn't exist, return false (they need to sign up)
    console.log('User not found in database');
    res.status(200).send({ exists: false }); // User not found, return false

  } catch (error) {
    console.error('Error checking user existence:', error);
    res.status(500).send({ error: 'Failed to check user existence' });
  }
});

// add a user to the database: auth (string), age (int), nickname (string)
// generate recommendations and gcal events and store in database
// targetConcerns (list of strings), improveAreas (list of strings)
app.post('/createuser', async (req, res) => {
  console.log('IN createuser ENDPOINT');
  console.log(req.body);
  try {
    const { code, uid, nickname, age, concerns, habits } = req.body;
    console.log(code);
    console.log(uid);
    console.log(nickname);
    console.log(age);
    console.log(concerns);
    console.log(habits);

    // if user already exists, just redirect to login endpoint
    const usersRef = db.collection('users');
    const querySnapshot = await usersRef.where('uid', '==', uid).get();

    if (!querySnapshot.empty) {
      console.log('User already exists. Redirecting to /login...');
      return res.status(302).send({ redirectUrl: '/login' }); // should not get here bc already handles before /createuser is called
      // 302 = Found (redirect), frontend handles it
    }

    // exchange authorization code for access + refresh tokens
    console.log('TRYING TO GET TOKENS');
    const oAuth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      'postmessage'
    );

    const { tokens } = await oAuth2Client.getToken(code);


    console.log('OBTAINED TOKENS', tokens);

    oAuth2Client.setCredentials(tokens);

    // gets simplified calendar events
    const calEvents = await getCalendarEvents(oAuth2Client);

    console.log('Events: ', calEvents);

    const recommendations = await getGeminiRecs(calEvents, concerns, habits);

    console.log("Gemini: ", recommendations);

    // Create user document first
    const docRef = await db.collection('users').add({
      code,
      uid,
      age,
      nickname,
      calEvents,
      concerns,
      habits,
      recommendations,
      createdAt: new Date()
    });

    // Save user's tokens under their user document
    console.log('saving user tokens');
    await saveUserTokens(docRef.id, tokens);
    console.log('done saving user tokens');

    console.log('Added a new user and stored tokens.');
    res.status(201).send({ message: 'User data and tokens saved', id: docRef.id });


  } catch (error) {
    console.error('Error adding user data:', error);
    res.status(500).send({ error: 'Failed to add user data' });
  }
});



// given auth, modifies list of new target concerns + improvement areas
// generates, store, return new recommendations
app.post('/modify-concerns', async (req, res) => {
  try {
    const { uid, newConcerns, newHabits } = req.body;
    console.log(uid, newConcerns, newHabits);
    // get user from db
    // get the user doc from uid to update
    const querySnapshot = await db.collection('users').where('uid', '==', uid).get();
    if (querySnapshot.empty) {
      console.error('No matching document found');
      return null;
    }
    const doc = querySnapshot.docs[0];
    const userRef = db.collection('users').doc(doc.id);
    const events = doc.data().calEvents;
    const newRecommendations = await getGeminiRecs(events, newConcerns, newHabits);
    console.log('new recommendations', newRecommendations);
    // update the user data
    await userRef.update({
      concerns: newConcerns,
      habits: newHabits,
      recommendations: newRecommendations,
      updatedAt: new Date()
    });

    console.log("processed concern modification!");

    res.status(200).send({ message: 'User concerns and improvement areas updated!' });
  } catch (error) {
    console.error('Error modifying user data:', error);
    res.status(500).send({ error: 'Failed to modify user data' });
  }
});

// get calendar events, updates db, regenerate recommendations
app.post('/update-cal', async (req, res) => {
  try {
    const { uid } = req.body;
    console.log('userid:', uid);

    // get and refresh tokens if needed
    const tokens = await loadTokensFromFirestore(uid);
    const oAuth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
    );
    console.log("tokens", tokens);

    oAuth2Client.setCredentials({
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
    });

    oAuth2Client.on('tokens', async (newTokens) => {
      if (newTokens.refresh_token) {
        await saveUserTokens(uid, newTokens);
      }
    });

    console.log('obtained/refreshed tokens', tokens);

    const events = await getCalendarEvents(oAuth2Client);
    console.log('Events: ', events);

    // get the user doc from uid to update
    const querySnapshot = await db.collection('users').where('uid', '==', uid).get();
    if (querySnapshot.empty) {
      console.error('No matching document found');
      return res.status(404).json({ message: 'No matching user found' });
    }

    const doc = querySnapshot.docs[0];
    const userRef = db.collection('users').doc(doc.id);
    const targetConcerns = doc.data().concerns;
    const improvementAreas = doc.data().habits;

    const newRecommendations = await getGeminiRecs(events, targetConcerns, improvementAreas);
    console.log('new recommendations', newRecommendations);

    await userRef.update({
      calEvents: events,
      recommendations: newRecommendations,
      updatedAt: new Date()
    });

    console.log('calendar events updated');

    return res.status(200).json({ message: 'Calendar updated successfully'});

  } catch (error) {
    console.error('Error updating calendar:', error);
    return res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});

// get user info
app.get('/getuserinfo', async (req, res) => {
  try {
    const { uid } = req.query;
    // const uid = "L5lRkUqonQXQZXLuCFjAOEk7mJg2"; // for testing
    const usersRef = db.collection('users');
    const querySnapshot = await usersRef.where('uid', '==', uid).get();

    if (!querySnapshot.empty) { // user exists
      const userData = querySnapshot.docs[0].data();
      console.log('User data:', userData);
      const { tokens, ...userDataWithoutTokens } = userData;
      return res.status(200).send({ message: 'User found', data: userDataWithoutTokens });
    } else {
      console.log('User not found.');
      return res.status(404).send({ message: 'User not found' });
    }
  } catch (e) {
    console.error('Error fetching user info:', e);
    res.status(500).send({ error: 'Internal server error' });
  }
});

app.post('/log-mood', async (req, res) => {
  try {
    const { uid, mood } = req.body;
    if (!uid) {
      return res.status(400).json({ message: 'uid is required' });
    }

    const querySnapshot = await db.collection('users').where('uid', '==', uid).get();
    if (querySnapshot.empty) {
      return res.status(404).json({ message: 'No user found with that UID' });
    }

    const userDoc = querySnapshot.docs[0];
    const userRef = db.collection('users').doc(userDoc.id);
    const userData = userDoc.data();
    const moodData = userData.moodData || [];
    const today = new Date();
    const dayOfWeek = today.getDay(); // Sunday = 0, Saturday = 6

    const startOfWeek = new Date(today);
    startOfWeek.setDate(`${today.getDate() - dayOfWeek}`);

    // calculating week range string
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    const formatDate = (date) => `${date.getMonth() + 1}/${date.getDate()}`;
    const weekRange = `${formatDate(startOfWeek)}-${formatDate(endOfWeek)}`;

    const weekArray = moodData[weekRange];
    weekArray[dayOfWeek] = mood;

    await userRef.update({
      moodData: moodData,
      updatedAt: new Date()
    });


    return res.status(200).json({ message: 'Mood logged successfully' });

  }catch (e) {
    console.error('Error logging mood:', error);
    return res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});
// export db if needed in other files
module.exports = { db };
