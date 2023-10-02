const DB = require('../utils/DB');

class User {
    static collection = 'users';

    email;
    phone;
    username;
    image;
    password;
    verify;

    constructor(email, phone, username, image, password, verify) {
        this.email = email;
        this.phone = phone;
        this.username = username;
        this.image = image;
        this.password = password;
        this.verify = verify;
    }

    static async FindAllUsers() {
        return await new DB().FindAll(User.collection);
    }

    static async FindById(id) {
        return await new DB().FindByID(User.collection, id);
    }

    static async FindByEmail(email) {
        return await new DB().FindEmail(User.collection, email);
    }

    static async FindByUserName(username) {
        return await new DB().FindUsername(User.collection, username);
    }

    static async LoginUser(username, password) {
        return await new DB().Login(User.collection, username, password);
    }

    async InsertOne(){
        return await new DB().Insert(User.collection, this);
    }

    static async EditUser(id, image, password, verify) {
        return await new DB().EditById(User.collection, id, image, password, verify);
    }

    static async EditUserToken(id, token){
        return await new DB().EditToken(User.collection, id, token);
    }

    static async DeleteUser(id){
        return await new DB().DeleteById(User.collection, id);
    }
}

module.exports = User;