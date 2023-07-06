const DB = require('../utils/DB');

class Restaurant {
    static collection = 'restaurants';

    name;
    location;
    foodType;
    availableSeats;
    locationSeats;

    constructor(name, location, foodType, availableSeats, locationSeats) {
        this.name = name;
        this.location = location;
        this.foodType = foodType;
        this.availableSeats = availableSeats;
        this.locationSeats = locationSeats;
    }

    static async FindAllRestaurants() {
        return await new DB().FindAll(Restaurant.collection);
    }

    static async FindById(id) {
        return await new DB().FindByID(Restaurant.collection, id);
    }

    async InsertOne() {
        return await new DB().Insert(Restaurant.collection, this);
    }

    static async FindRestaurantsForUser(location, foodType, diners) {
        return await new DB().FindRestaurantsByInputs(Restaurant.collection, location, foodType, diners);
    }

    static async UpdateSeats(id, seatType, numDiners) {
        return await new DB().UpdateSeatsByReservation(Restaurant.collection, id, seatType, numDiners);
    }

    static async DeleteRestaurant(id){
        return await new DB().DeleteById(Restaurant.collection, id);
    }

    static async AddOrder(id, userId, seatType, diners) {
        return await new DB().UpdateOrder(Restaurant.collection, id, userId, seatType, diners);
    }
}


module.exports = Restaurant;