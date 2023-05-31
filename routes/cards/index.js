const express = require('express');
const cardsRouter = express.Router();
const { createAllCardsSummary } = require('../../controllers/cardController')


cardsRouter.post('/addAllCards', createAllCardsSummary);

cardsRouter.get('/', async function (req, res, next) {
    const {data} = await axios.get('https://api.scryfall.com/cards/random')
    console.log(data)
    res.status(200).send(data)
});

module.exports = cardsRouter;