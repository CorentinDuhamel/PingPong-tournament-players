const express = require('express');
const path = require('path');
const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
require('dotenv').config();

// Initialize Express
const app = express();
const PORT = process.env.PORT || 3000;

// Initialize Firebase Admin SDK
const serviceAccount = {
  type: process.env.FIREBASE_TYPE,
  project_id: process.env.FIREBASE_PROJECT_ID,
  private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
  private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
  client_email: process.env.FIREBASE_CLIENT_EMAIL,
  client_id: process.env.FIREBASE_CLIENT_ID,
  auth_uri: process.env.FIREBASE_AUTH_URI,
  token_uri: process.env.FIREBASE_TOKEN_URI,
  auth_provider_x509_cert_url: process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
  client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL
};

initializeApp({
  credential: cert(serviceAccount),
});

const participationRoutes = require('./routes/participation');

app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use('/api/participation', participationRoutes);



const protocol = process.env.ENV === 'prod'
? req.protocol
: 'http';
const host = process.env.ENV === 'prod'
? req.get('host')
: 'localhost:3000';


app.get('/', async (req, res) => {
  try {
    const url = `${protocol}://${host}/api/participation`;
    
    const response = await fetch(url);

    // Vérifiez que la réponse est OK (statut 200)
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (!data || !data.allData || !data.committees) {
      throw new Error("Invalid data received from API");
    }

    res.render('index', { allData: data.allData, committees: data.committees });
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).send("Server error");
  }
});


app.listen(PORT, () => {
  console.log(`Server started on ${protocol}://${host}`);
});