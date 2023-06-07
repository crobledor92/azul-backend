require('dotenv').config()
const express = require('express')
const cors = require('cors');
const app = express()

//importamos dotenv para poder gestionar el puerto del backend con variable de entorno

const port = process.env.PORT || 5000;
const axios = require('axios')

//importamos función conexión a mongo y la ejecutamos
const { mongo } = require('./mongo')
mongo()

//Le decimos a nuestra app que permita hacer peticiones post y put.
app.use(cors())
// app.use(express.urlencoded({extended: true}));

//Le decimos a nuestra app que vamos a recibir peticiones con el body en formato JSON
app.use(express.json())

// importamos el router general y le pedimos a nuestra app que lo utilice.
const generalRouter = require('./routes')
app.use(generalRouter)



app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})


