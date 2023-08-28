const { MongoClient, ObjectId } = require('mongodb');
require('dotenv').config();
const nodemailer = require('nodemailer');

class DB {

    client;
    dbName;
    emailService;
    emailUsername;
    emailPassword;
    googleApi;

    constructor() {
        this.client = new MongoClient(process.env.DB_URI);
        this.dbName = process.env.DB_NAME;
        this.emailService = process.env.EMAIL_SERVICE;
        this.emailUsername = process.env.EMAIL_USERNAME;
        this.emailPassword = process.env.EMAIL_PASSWORD;
        this.googleApi = process.env.GOOGLE_MAPS_API_KEY;
    }

    async getGoogleMapsApiKey() {
        return this.googleApi; 
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

    async Login(collection, username, password) {
        try {
            await this.client.connect();
            return await this.client.db(this.dbName).collection(collection).findOne(
                {$and: [
                    {
                      $or: [
                        { email: username },
                        { username: username }
                      ]
                    },
                    { password: password }
                  ]
                });
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

    async FindManyRestaurants(collection, foodType, diners) {
        try {
          await this.client.connect();
          const query = {
            foodType: foodType,
            availableSeats: { $gte: parseInt(diners) }
          };
          return await this.client.db(this.dbName).collection(collection).find(query).toArray();
        } catch (error) {
          return error;
        } finally {
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

    async UpdateSeatsAfterReservation(collection, id, seatType, numDiners) {
        try {
          await this.client.connect();
          return await this.client.db(this.dbName).collection(collection).updateOne(
            { _id: new ObjectId(id) },
            {
              $inc: {
                [`locationSeats.${seatType}`]: + parseInt(numDiners), // Increment instead of decrement
                availableSeats: + parseInt(numDiners) 
              }
            }
          );
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
                _id : new ObjectId(),
                userId: new ObjectId(userId),
                diners: parseInt(diners),
                seatType: seatType,
                approved: false,
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

    async InsertReview(collection, id, user, rating, description) {
        try {
            await this.client.connect();
            let review = {
                _id : new ObjectId(),
                user: user,
                rating: parseInt(rating),
                description: description,
                createdAt: new Date().toLocaleString('en-US', { timeZone: 'Asia/Jerusalem' })
            };
            return await this.client.db(this.dbName).collection(collection).updateOne(
                { _id: new ObjectId(id) },
                { $push: { reviews: review } }
            );
        } catch (error) {
            return error;
        }  finally {
            await this.client.close();
        }
    }

    async UpdateOrderApproval(collection, id, orderId) {
        try {
          await this.client.connect();
          return await this.client.db(this.dbName).collection(collection).updateOne(
            { 
              _id: new ObjectId(id),
              'orders._id': new ObjectId(orderId)
            },
            { $set: { 'orders.$.approved': true } }
          );
        } catch (error) {
          return error;
        } finally {
          await this.client.close();
        }
    }

    async DeleteOrder(collection, id, orderId) {
        try {
            await this.client.connect();
            return await this.client.db(this.dbName).collection(collection).updateOne(
                { _id: new ObjectId(id) },
                { $pull: { orders: { _id: new ObjectId(orderId) } } }
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

    async AddMenuItem(collection, id, name, price, image, category) {
        try {
            await this.client.connect();
            let item = {
                _id: new ObjectId(),
                name: name,
                price: price,
                image: image,
                category: category
            };
            await this.client.db(this.dbName).collection(collection).updateOne(
                { _id: new ObjectId(id) },
                { $push: { menu: item } }
            );

            // Retrieve the newly added item from the database
            const newItem = await this.client.db(this.dbName).collection(collection).findOne(
                { _id: new ObjectId(id), 'menu._id': item._id },
                { projection: { 'menu.$': 1 } } // Only retrieve the newly added menu item
            );
            return newItem.menu[0]; // Return the newly added menu item

        } catch (error) {
            return error;
        }  finally {
            await this.client.close();
        }
    }

    async DeleteMenuItem(collection, id, itemId) {
        try {
            await this.client.connect();
            return await this.client.db(this.dbName).collection(collection).updateOne(
                { _id: new ObjectId(id) },
                { $pull: { menu: { _id: new ObjectId(itemId) } } }, 
                { new: true }
            );
        } catch (error) {
            return error;
        }  finally {
            await this.client.close();
        }
    }

    async DeleteReviewItem(collection, id, reviewId) {
        try {
            await this.client.connect();
            return await this.client.db(this.dbName).collection(collection).updateOne(
                { _id: new ObjectId(id) },
                { $pull: { reviews: { _id: new ObjectId(reviewId) } } }, 
                { new: true }
            );
        } catch (error) {
            return error;
        }  finally {
            await this.client.close();
        }
    }

    async EditMenuItem(collection, id, itemId, name, price, image, category) {
        try {
            await this.client.connect();
            return await this.client.db(this.dbName).collection(collection).updateOne(
                { _id: new ObjectId(id), 'menu._id': new ObjectId(itemId) },
                { $set: { 'menu.$.name': name, 'menu.$.price': price, 'menu.$.image': image, 'menu.$.category': category } }
            );
        } catch (error) {
            return error;
        }  finally {
            await this.client.close();
        }
    }

    async EditReviewItem(collection, id, reviewId, user, rating, description) {
        try {
            await this.client.connect();
            let createdAt = new Date().toLocaleString('en-US', { timeZone: 'Asia/Jerusalem' })
            return await this.client.db(this.dbName).collection(collection).updateOne(
                { _id: new ObjectId(id), 'reviews._id': new ObjectId(reviewId) },
                { $set: { 'reviews.$.user': user, 'reviews.$.rating': rating, 'reviews.$.description': description, 'reviews.$.createdAt': createdAt } }
            );
        } catch (error) {
            return error;
        }  finally {
            await this.client.close();
        }
    }
}

module.exports = DB;