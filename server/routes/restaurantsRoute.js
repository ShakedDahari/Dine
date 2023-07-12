const Restaurant = require('../models/restaurants');
const restaurantsRoute = require('express').Router();
require('dotenv').config();
const nodemailer = require('nodemailer');

restaurantsRoute.get('/', async (req, res) => {
    try {
        let data = await Restaurant.FindAllRestaurants();
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error });
    }
});

restaurantsRoute.get('/:id', async (req, res) => {
    try {
        let { id } = req.params;
        let data = await Restaurant.FindById(id);
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error });
    }
});

restaurantsRoute.get('/email/:email', async (req, res) => {
    try {
        let { email } = req.params;
        let data = await Restaurant.FindByEmail(email);
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error });
    }
});

restaurantsRoute.post('/add', async (req, res) => {
    try {
        let { email, phone, name, location, address, foodType, image, availableSeats, locationSeats: { inside, outside, bar }, password, verify } = req.body;
        let data = await new Restaurant(email, phone, name, location, address, foodType, image, availableSeats, { inside, outside, bar }, password, verify).InsertOne();
        res.status(201).json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

restaurantsRoute.post('/find', async (req, res) => {
    try {
        let { location, foodType, diners } = req.body;
        let data = await Restaurant.FindRestaurantsForUser(location, foodType, diners);
        res.status(201).json(data);
    } catch (error) {
        res.status(500).json({ error });
    }
});

restaurantsRoute.post('/orders/:id', async (req, res) => {
    try {
        let { id } = req.params;
        let { userId, seatType, diners } = req.body;
        let data = await Restaurant.AddOrder(id, userId, seatType, diners);
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error });
    }
});

restaurantsRoute.put('/seats', async (req, res) => {
    try {
      let { id, seatType, numDiners } = req.body;
      let data = await Restaurant.UpdateSeats(id, seatType, numDiners);
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ error });
    }
});

restaurantsRoute.put('/approved/:id', async (req, res) => {
    try {
      let { id } = req.params;
      let data = await Restaurant.ChangeApproved(id);
      res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error });
    }
});


restaurantsRoute.post('/sendemail', async (req, res) => {
    try {
        let { email, subject, message } = req.body;
        let data = await Restaurant.SendEmail(email, subject, message);
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error });
    }
});


restaurantsRoute.delete('/delete/:id', async (req, res) =>{
    try {
        let { id } = req.params;
        let data = await Restaurant.DeleteRestaurant(id);
        res.status(201).json(data);
    } catch (error) {
        res.status(500).json({ error : error.message });
    }
});


module.exports = restaurantsRoute;