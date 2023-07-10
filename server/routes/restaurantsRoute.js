const Restaurant = require('../models/restaurants');
const restaurantsRoute = require('express').Router();
const { sendEmail } = require('../models/email');
// require('dotenv').config();
// const nodemailer = require('nodemailer');

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
      let { email, name } = req.body;
      let data = await Restaurant.ChangeApproved(id, email, name);
      //await sendEmail(email, name);
      //console.log(data);
      res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error });
    }
});

restaurantsRoute.post("/sendEmail", sendEmail);

// const sendEmail = async (email, name) => {
      
//     console.log("send email");
//     let transporter = await nodemailer.createTransport({
//         host: 'smtp.gmail.com', // replace with the correct hostname
//         port: 587, // replace with the correct port number
//         secure: false,
//         service: process.env.EMAIL_SERVICE,
//         auth: {
//           user: process.env.EMAIL_USERNAME,
//           pass: process.env.EMAIL_PASSWORD,
//         },
//       });
    
//       // Prepare and send the email
//       let mailOptions = await {
//         from: process.env.EMAIL_USERNAME,
//         to: email,
//         subject: 'Restaurant Approval',
//         text: `Congratulations! Your restaurant ${name} has been approved.`,
//         html: `<p>Congratulations! Your restaurant ${name} has been approved.</p>`,
//       };
    
//       try {
//         const info = await transporter.sendMail(mailOptions);
//         console.log('Approval email sent successfully', info);
//       } catch (error) {
//         console.error('Error sending approval email:', error);
//         // throw the error to be caught and handled further
//       }

// }

//   let transporter = await nodemailer.createTransport({
//     host: 'smtp.gmail.com', // replace with the correct hostname
//     port: 587, // replace with the correct port number
//     secure: false,
//     service: process.env.EMAIL_SERVICE,
//     auth: {
//       user: process.env.EMAIL_USERNAME,
//       pass: process.env.EMAIL_PASSWORD,
//     },
//   });

//   // Prepare and send the email
//   let mailOptions = await {
//     from: process.env.EMAIL_USERNAME,
//     to: email,
//     subject: 'Restaurant Approval',
//     text: `Congratulations! Your restaurant ${name} has been approved.`,
//     html: `<p>Congratulations! Your restaurant ${name} has been approved.</p>`,
//   };

//   try {
//     const info = await transporter.sendMail(mailOptions);
//     console.log('Approval email sent successfully', info);
//   } catch (error) {
//     console.error('Error sending approval email:', error);
//   }

// restaurantsRoute.post('/approval', async (req, res) => {
//     try {
//         let { email, name } = req.body;
//         let data = await Restaurant.SendEmail(email, name);
//         res.status(200).json(data);
//     } catch (error) {
//       console.error('Error sending ', error);
//       res.status(500).json({ error });
//     }
// });
  

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