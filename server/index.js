require('dotenv').config();

const express = require('express');
const cors = require('cors');
const path = require('path');

const PORT = process.env.PORT || 5500;

const DB = require('../server/utils/DB'); 
const db = new DB();

const server = express();
server.use(cors());
server.use(express.json());
//server.use(express.static(path.join(__dirname, '../client', 'dist')));

// Route to provide Google Maps API key
server.get('/api/google-maps-api-key', async(req, res) => {
    const apiKey = await db.getGoogleMapsApiKey();
    res.json({ apiKey });
});

// Route to provide firebase config
server.get('/api/firebase-config', async(req, res) => {
    const firebaseConfig = await db.getFirebaseConfig(); 
    res.json({ firebaseConfig });
});

server.use('/api/users', require('./routes/usersRoute'));

server.use('/api/foodTypes', require('./routes/foodTypesRoute'));

server.use('/api/restaurants', require('./routes/restaurantsRoute'));

// server.get('/*', async(req, res) => {
//     res.sendFile(path.join(__dirname, 'dist', 'index.html'));
// })


server.get('/',function(req, res) {
    const ipAddress = req.header('x-forwarded-for') ||
                          req.socket.remoteAddress;
    res.send(ipAddress);
});

server.listen(PORT, () => console.log(`http://localhost:${PORT}`));