const express = require('express');
const generalRouter = express.Router();
const cardsRoutes = require('./cards')
const usersRoutes = require('./users')
const messagesRoutes = require('./messages')

generalRouter.use('/cards', cardsRoutes)
generalRouter.use('/', usersRoutes)
generalRouter.use('/', messagesRoutes)

module.exports = generalRouter;