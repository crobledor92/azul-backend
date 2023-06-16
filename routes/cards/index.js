const express = require('express');
const cardsRouter = express.Router();
const { createAllCardsSummary, getCardDetail, getRandomCards, getSearchedCards, putOnSell } = require('../../controllers/cardController')
const Card = require('../../models/card.model');


cardsRouter.post('/addAllCards', createAllCardsSummary);

cardsRouter.get('/search', getSearchedCards);

cardsRouter.get('/random', getRandomCards)
  
cardsRouter.get('/:cardId', getCardDetail)

cardsRouter.post('/sellCard', putOnSell)


module.exports = cardsRouter;