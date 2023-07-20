const { MongoClient, ObjectId } = require('mongodb');
require('dotenv').config();
const nodemailer = require('nodemailer');

class DB {

    client;
    dbName;
    emailService;
    emailUsername;
    emailPassword;

    constructor() {
        this.client = new MongoClient(process.env.DB_URI);
        this.dbName = process.env.DB_NAME;
        this.emailService = process.env.EMAIL_SERVICE;
        this.emailUsername = process.env.EMAIL_USERNAME;
        this.emailPassword = process.env.EMAIL_PASSWORD;
    }
    
    async FindAll(collection, query = {}, projection = {}) {
        try {
            await this.client.connect();
            return await this.client.db(this.dbName).collection(collection).find(query, projection).toArray();
        } catch (error) {
            return error;
        }
        finally {
            await this.client.close();
        }
    }

    async FindByID(collection, id) {
        try {
            await this.client.connect();
            return await this.client.db(this.dbName).collection(collection).findOne({ _id: new ObjectId(id) });
        } catch (error) {
            return error;
        }
        finally {
            await this.client.close();
        }
    }

    async FindEmail(collection, email) {
        try {
            await this.client.connect();
            return await this.client.db(this.dbName).collection(collection).findOne({ email: email });
        } catch (error) {
            return error;
        } 
        finally {
            await this.client.close();
        }
    }

    async FindUsername(collection, username) {
        try {
            await this.client.connect();
            return await this.client.db(this.dbName).collection(collection).findOne({ username: username });
        } catch (error) {
            return error;
        } 
        finally {
            await this.client.close();
        }
    }

    async Insert(collection, doc) {
        try {
            await this.client.connect();
            doc.createdAt = new Date().toLocaleString('en-US', { timeZone: 'Asia/Jerusalem' });
            return await this.client.db(this.dbName).collection(collection).insertOne(doc);
        } catch (error) {
            return error;
        } finally {
            await this.client.close();
        }
    }

    async FindRestaurantsByInputs(collection, location, foodType, diners) {
        try {
            await this.client.connect();

            const agg = [
                {
                  '$match': {
                    location: location, 
                    foodType: foodType, 
                    availableSeats: {
                      '$gte': parseInt(diners)
                    }
                  }
                }
              ];
            return await this.client.db(this.dbName).collection(collection).aggregate(agg).toArray();
        } catch (error) {
            return error;
        }
        finally {
            await this.client.close();
        }
    }

    async UpdateSeatsByReservation(collection, id, seatType, numDiners) {
        try {
            await this.client.connect();   
            return await this.client.db(this.dbName).collection(collection).updateOne(
                { _id: new ObjectId(id) },
            {
            $inc: {
                [`locationSeats.${seatType}`]: - parseInt(numDiners),
                availableSeats: - parseInt(numDiners)
              }
            });     
        } catch (error) {
            return error;
        } finally {
            await this.client.close();
        }
    }

    async DeleteById(collection, id) {
        try {
            await this.client.connect();
            return await this.client.db(this.dbName).collection(collection).deleteOne({ _id: new ObjectId(id) });
        } catch (error) {
            return error;
        }  finally {
            await this.client.close();
        }
    }

    async UpdateOrder(collection, id, userId, seatType, diners) {
        try {
            await this.client.connect();
            let order = {
                userId: new ObjectId(userId),
                diners: diners,
                seatType: seatType,
                createdAt: new Date().toLocaleString('en-US', { timeZone: 'Asia/Jerusalem' })
            };
            return await this.client.db(this.dbName).collection(collection).updateOne(
                { _id: new ObjectId(id) },
                { $push: { orders: order } }
            );
        } catch (error) {
            return error;
        }  finally {
            await this.client.close();
        }
    }

    async ApprovedRestaurant(collection, id) {
        try {
            await this.client.connect();
            return await this.client.db(this.dbName).collection(collection).updateOne(
                { _id: new ObjectId(id) }, 
                { $set: {approved : true}}
            );
        } catch (error) {
            return error;
        }  finally {
            await this.client.close();
        }
    }

    async SendEmailApproval(email, subject, message) {
        try {
            const transporter = nodemailer.createTransport({
                host: 'smtp.gmail.com',
                port: 587,
                secure: false, 
                service: this.emailService,
                auth: {
                    user:  this.emailUsername,
                    pass: this.emailPassword,
                },
            });
        
          const mailOptions = {
            from: this.emailUsername,
            to: email,
            subject: subject,
            text: message,
            html: `<p>${message}</p>`,
          };
        
          const info = await transporter.sendMail(mailOptions);
          console.log('Approval email sent successfully', info);
          return info;

        } catch (error) {
            return error;
        } 
    }

}

module.exports = DB;