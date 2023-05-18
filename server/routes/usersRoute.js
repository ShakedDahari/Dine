const User = require('../models/users');
const usersRoute = require('express').Router();

usersRoute.get('/', async (req, res) => {
    try {
        let data = await User.FindAllUsers();
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error });
    }
});

usersRoute.get('/:id', async (req, res) => {
    try {
        let { id } = req.params;
        let data = await User.FindById(id);
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error });
    }
});

usersRoute.post('/add', async (req, res) => {
    try {
        let { email, phone, username, image, password, verify } = req.body;
        let data = await new User(email, phone, username, image, password, verify).InsertOne();
        res.status(201).json(data);
    } catch (error) {
        res.status(500).json({ error });
    }
});


module.exports = usersRoute;