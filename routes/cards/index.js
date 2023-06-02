const express = require('express');
const cardsRouter = express.Router();
const { createAllCardsSummary } = require('../../controllers/cardController')
const Card = require('../../models/card.model');



cardsRouter.post('/addAllCards', createAllCardsSummary);

cardsRouter.get('/', async function (req, res, next) {
    const {data} = await axios.get('https://api.scryfall.com/cards/random')
    console.log(data)
    res.status(200).send(data)
});

cardsRouter.get('/random', async function (req, res, next) {
    const count = parseInt(req.query.count) || 1; // Obtener el valor del parámetro count, si no se proporciona, se asume 1
    const randomCards = await Card.aggregate([{ $sample: { size: count } }]);
    
    const cardData = randomCards.map(({ name, image_uris }) => ({
      name,
      normalImageUrl: image_uris.normal
    }));
  
    res.status(200).json(cardData);
    console.log('cardData es:', cardData);
  });




module.exports = cardsRouter;