const express = require('express')
const cors = require('cors');
const app = express()
const port = 5000
const axios = require('axios')

require('dotenv').config()
const mongoose = require("mongoose")
const mongoDB = "mongodb+srv://"+process.env.DB_USER+":"+process.env.DB_PASSWORD+"@fwmongoose.qyjvfzo.mongodb.net/"+process.env.DB_NAME+"?retryWrites=true&w=majority"
async function main() {
  await mongoose.connect(mongoDB)
}
main().catch(err => console.log(err))

const cardRouter = require('./routes/cards')
const userRouter = require('./routes/users')

app.use(cors())
app.use(express.urlencoded({extended: true}));
app.use(express.json())

app.use('/cards', cardRouter)
app.use('/user', userRouter)


app.get('/', async function (req, res, next) {
    const {data} = await axios.get('https://api.scryfall.com/cards/random')
    console.log(data)
    res.status(200).send(data)
  });


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})


