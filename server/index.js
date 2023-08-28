require('dotenv').config();

const express = require('express');
const cors = require('cors');
const path = require('path');

const PORT = process.env.PORT || 5500;

const DB = require('../server/utils/DB'); // Import your DB class definition
const db = new DB();

const server = express();
server.use(cors());
server.use(express.json());
//server.use(express.static(path.join(__dirname, '../client', 'dist')));

// Route to provide Google Maps API key
server.get('/api/google-maps-api-key', (req, res) => {
    const apiKey = db.getGoogleMapsApiKey();
    console.log(apiKey);
    res.json({ apiKey });
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