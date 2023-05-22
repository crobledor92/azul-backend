const express = require('express')
const cors = require('cors');
const app = express()
const port = 5000
const axios = require('axios')

const tasksRouter = require('./routes/index')

app.use(cors())
app.use(express.urlencoded({extended: true}));
app.use(express.json())

app.use('/cards', tasksRouter)

app.get('/', async function (req, res, next) {
    const {data} = await axios.get('https://api.scryfall.com/cards/random')
    console.log(data)
    res.status(200).send(data)
  });


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})


