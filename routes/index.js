const express = require('express');
const generalRouter = express.Router();
const cardsRoutes = require('./cards')
const userRoutes = require('./users')
/* GET home page. */

generalRouter.use('/cards', cardsRoutes)
generalRouter.use('/', userRoutes)

module.exports = generalRouter;