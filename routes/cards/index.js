const express = require('express');
const cardsRouter = express.Router();
const { createAllCardsSummary, getCardDetail, getRandomCards, getSearchedCards } = require('../../controllers/cardController')
const Card = require('../../models/card.model');


cardsRouter.post('/addAllCards', createAllCardsSummary);

cardsRouter.get('/search', getSearchedCards);

cardsRouter.get('/random', getRandomCards)
  
cardsRouter.get('/:cardId', getCardDetail)


module.exports = cardsRouter;