const mongoose = require("mongoose");
const jwt = require('jsonwebtoken');
const secret = process.env.JWT_SECRET;
const bcrypt = require('bcrypt');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    name: {type: String, required: true},
    surname: {type: String, required: true},
    birthdate: {type: Date, required: true},
    address: {type: String},
    email: {type: String, required: true, unique: true, trim: true},
    phone: {type: Number},
    username: {type: String, required: true, unique: true, trim: true},
    password: {type: String, required: true},
    deletedAt: {type: Date},
    },
    {timestamps: true}
);

UserSchema.methods.comparePassword = function(password) {
    return bcrypt.compareSync(password, this.password)
}

UserSchema.methods.generateJWT = function() {

    let payload = {
        id: this._id,
        username: this.username,
        email: this.email,
    }

    return jwt.sign(payload,secret, {expiresIn: '1h'})
}

module.exports = mongoose.model("User", UserSchema);