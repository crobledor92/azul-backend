const express = require('express');
const cardsRouter = express.Router();
const { tokenValidator } = require("../../middlewares/tokenValidator");
const { createAllCardsSummary, getCardDetail, getRandomCards, getSearchedCards, putOnSell, getCardsOnSell, getAllOnSell, getCardsInCollections, buyCard, onCartCard, bidUpCard, buyCardsOnCart, deleteCardFromCart, getEndOfBidCards, delCard} = require('../../controllers/cardController');

const Card = require('../../models/card.model');


// cardsRouter.post('/addAllCards', createAllCardsSummary);

cardsRouter.get('/search', getSearchedCards);

cardsRouter.get('/random', getRandomCards)

cardsRouter.get('/searchSelled', getCardsOnSell)

cardsRouter.post('/buycard', tokenValidator, buyCard)

cardsRouter.post('/oncartcard', tokenValidator, onCartCard)

cardsRouter.put('/deleteCardFromCart', tokenValidator, deleteCardFromCart)

cardsRouter.put('/buyCardsOnCart', tokenValidator, buyCardsOnCart)

cardsRouter.get ('/cardcollections', getCardsInCollections)

cardsRouter.get('/endOfBid', getEndOfBidCards);

cardsRouter.post('/delcard', tokenValidator, delCard)

cardsRouter.get('/getAllOnSell', getAllOnSell)

cardsRouter.get('/:cardId', getCardDetail)

cardsRouter.post('/sellCard', tokenValidator, putOnSell)

cardsRouter.post('/bidupcard', tokenValidator, bidUpCard)






module.exports = cardsRouter;