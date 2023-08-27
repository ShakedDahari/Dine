const DB = require('../utils/DB');

class Restaurant {
    static collection = 'restaurants';

    email;
    phone;
    name;
    location; 
    foodType; 
    image;
    availableSeats; 
    locationSeats;
    password;
    verify;
    approved;

    constructor(email, phone, name, location, foodType, image, availableSeats, { inside, outside, bar }, password, verify) {
        this.email = email;
        this.phone = phone;
        this.name = name;
        this.location = location;
        this.foodType = foodType;
        this.image = image;
        this.availableSeats = availableSeats;
        this.locationSeats = { inside, outside, bar };
        this.password = password;
        this.verify = verify;
        this.approved = false;
    }

    static async FindAllRestaurants() {
        return await new DB().FindAll(Restaurant.collection);
    }

    static async FindById(id) {
        return await new DB().FindByID(Restaurant.collection, id);
    }

    static async LoginRestaurant(username, password) {
        return await new DB().Login(Restaurant.collection, username, password);
    }

    async InsertOne() {
        return await new DB().Insert(Restaurant.collection, this);
    }
    
    static async FindByEmail(email) {
        return await new DB().FindEmail(Restaurant.collection, email);
    }

    static async FindRestaurantsForUser(location, foodType, diners) {
        return await new DB().FindRestaurantsByInputs(Restaurant.collection, location, foodType, diners);
    }

    static async FindRestaurants(foodType, diners) {
        return await new DB().FindManyRestaurants(Restaurant.collection, foodType, diners);
    }

    static async UpdateSeats(id, seatType, numDiners) {
        return await new DB().UpdateSeatsByReservation(Restaurant.collection, id, seatType, numDiners);
    }

    static async UpdateSeatsBack(id, seatType, numDiners) {
        return await new DB().UpdateSeatsAfterReservation(Restaurant.collection, id, seatType, numDiners);
    }

    static async DeleteRestaurant(id){
        return await new DB().DeleteById(Restaurant.collection, id);
    }

    static async AddOrder(id, userId, seatType, diners) {
        return await new DB().UpdateOrder(Restaurant.collection, id, userId, seatType, diners);
    }

    static async AddReview(id, user, rating, description) {
        return await new DB().InsertReview(Restaurant.collection, id, user, rating, description);
    }

    static async OrderApproval(id, orderId) {
        return await new DB().UpdateOrderApproval(Restaurant.collection, id, orderId);
    }

    static async DeleteOrder(id, orderId) {
        return await new DB().DeleteOrder(Restaurant.collection, id, orderId);
    }

    static async ChangeApproved(id) {
        return await new DB().ApprovedRestaurant(Restaurant.collection, id);
    }

    static async SendEmail(email, subject, message) {
        return await new DB().SendEmailApproval(email, subject, message);
    }

    static async AddItem(id, name, price, image, category) {
        return await new DB().AddMenuItem(Restaurant.collection, id, name, price, image, category);
    }

    static async DeleteItem(id, itemId) {
        return await new DB().DeleteMenuItem(Restaurant.collection, id, itemId);
    }

    static async DeleteReview(id, reviewId) {
        return await new DB().DeleteReviewItem(Restaurant.collection, id, reviewId);
    }

    static async EditMenu(id, itemId, name, price, image, category) {
        return await new DB().EditMenuItem(Restaurant.collection, id, itemId, name, price, image, category);
    }

    static async EditReview(id, reviewId, user, rating, description) {
        return await new DB().EditReviewItem(Restaurant.collection, id, reviewId, user, rating, description);
    }
}


module.exports = Restaurant;