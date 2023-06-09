
const mongoose = require("mongoose")

const mongoDB = "mongodb+srv://"+process.env.DB_USER+":"+process.env.DB_PASSWORD+"@fwmongoose.qyjvfzo.mongodb.net/"+process.env.DB_NAME+"?retryWrites=true&w=majority"

async function mongo() {
    await mongoose.connect(mongoDB)
    .catch(err => console.log(err))
}

module.exports = { mongo }