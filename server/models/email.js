const expressAsyncHandler = require("express-async-handler");
const dotenv = require("dotenv");
const nodemailer = require("nodemailer");
dotenv.config();


const sendEmail = expressAsyncHandler(async (req, res) => {

    try {
        let transporter = nodemailer.createTransport({
          host: 'smtp.gmail.com',
          port: 587,
          service: process.env.EMAIL_SERVICE,
          secure: false, // true for 465, false for other ports
          auth: {
            user: process.env.EMAIL_USERNAME, // generated ethereal user
            pass: process.env.EMAIL_PASSWORD, // generated ethereal password
          },
        });
    
      const { email, subject, message } = req.body;
      console.log(email, subject, message);
    
      const mailOptions = {
        from: process.env.EMAIL_USERNAME,
        to: email,
        subject: subject,
        text: message,
      };
    
       transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log(error);
        } else {
          console.log("Email sent successfully!", info);
          res.status(200).json(info);
        }
      });
      
    } catch (error) {
        res.status(500).json({error: error.message});
    }
});

module.exports = { sendEmail };