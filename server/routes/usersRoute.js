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

usersRoute.get('/email/:email', async (req, res) => {
    try {
        let { email } = req.params;
        let data = await User.FindByEmail(email);
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error });
    }
});

usersRoute.get('/username/:username', async (req, res) => {
    try {
        let { username } = req.params;
        let data = await User.FindByUserName(username);
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error });
    }
})

usersRoute.post('/add', async (req, res) => {
    try {
        let { email, phone, username, image, password, verify } = req.body;
        let data = await new User(email, phone, username, image, password, verify).InsertOne();
        res.status(201).json(data);
    } catch (error) {
        res.status(500).json({ error });
    }
});


usersRoute.delete('/delete/:id', async (req, res) => {
    try {
        let { id } = req.params;
        let data = await User.DeleteUser(id);
        res.status(201).json(data)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})
module.exports = usersRoute;