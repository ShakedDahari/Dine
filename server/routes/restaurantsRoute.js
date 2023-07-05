const Restaurant = require('../models/restaurants');
const restaurantsRoute = require('express').Router();

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

restaurantsRoute.post('/add', async (req, res) => {
    try {
        let { name, location, foodType, availableSeats, locationSeats } = req.body;
        let data = await new Restaurant(name, location, foodType, availableSeats, locationSeats).InsertOne();
        res.status(201).json(data);
    } catch (error) {
        res.status(500).json({ error });
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

restaurantsRoute.put('/seats', async (req, res) => {
    try {
      let { id, seatType, numDiners } = req.body;
    //   console.log(req.body);
      let data = await Restaurant.UpdateSeats(id, seatType, numDiners);
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