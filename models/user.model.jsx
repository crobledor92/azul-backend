const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: {type: String, required: true},
    surname: {type: String, required: true},
    birthdate: {type: Date, required: true},
    address: {type: String},
    email: {type: String, required: true, unique: true},
    phone: {type: Number},
    username: {type: String, required: true, unique: true},
    password: {type: String, required: true, unique: true},
    deletedAt: {type: Date},
    },
    {timestamps: true}
);

module.exports = mongoose.model("User", userSchema);