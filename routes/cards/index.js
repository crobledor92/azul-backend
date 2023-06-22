const express = require('express');
const cardsRouter = express.Router();
const { tokenValidator } = require("../../middlewares/tokenValidator");
const { createAllCardsSummary, getCardDetail, getRandomCards, getSearchedCards, putOnSell, getCardsOnSell, getCardsInCollections} = require('../../controllers/cardController');

const Card = require('../../models/card.model');


cardsRouter.post('/addAllCards', createAllCardsSummary);

cardsRouter.get('/search', getSearchedCards);

cardsRouter.get('/random', getRandomCards)

cardsRouter.get('/searchSelled', getCardsOnSell)

cardsRouter.get ('/cardcollections', getCardsInCollections)

cardsRouter.get('/:cardId', getCardDetail)

cardsRouter.post('/sellCard', tokenValidator, putOnSell)



module.exports = cardsRouter;