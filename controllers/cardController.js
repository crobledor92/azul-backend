const User = require('../models/user.model')
const Card = require('../models/card.model');
const axios =require ('axios')
const sellCard = require('../models/sellcard.model');
const { ObjectID } =require('mongoose');
const { tokenValidator } = require('../middlewares/tokenValidator');
const mongoose = require('mongoose');

//Lógica para traer el .json con la data de las cartas y parsearlo
// const path = require('path');
// const allCardsDirectory = path.join('data', 'allCards.json')
// const fs = require('fs');
// const jsonData = fs.readFileSync(allCardsDirectory);
// const allCardsData = JSON.parse(jsonData);
const createAllCardsSummary = (req, res) => {
    allCardsData.forEach(e => {
        if (e.image_uris && e.image_uris.small && e.image_uris.normal) {        
        Card.create([
            {
                id_scryfall: e.id,
                name: e.name,
                image_uris: {
                    small: e.image_uris.small,
                    normal: e.image_uris.normal,
                },
                set: e.set,
                set_name: e.set_name,
            }
        ])
        }else{
        console.log('La carta no tiene la estructura de datos esperada:', e);
          }
    })    
}

const getCardDetail = async function (req, res, next) {
    const cardId = req.params.cardId; // Obtener el valor del parámetro de ruta ":cardId"
    try {
      const card = await Card.findById(cardId); // Buscar la carta por el objectID de mongo
      if (!card) {
        // Si no se encuentra la carta, devolver una respuesta de error
        return res.status(404).json({ error: 'Carta no encontrada' });
      }      
      // Obtener el valor de id_scryfall de la carta encontrada
      const idScryfall = card.id_scryfall;
      // Obtenemos la carta con ese ID en la API de scryfall con todo su contenido
      const { data } = await axios.get(`https://api.scryfall.com/cards/${idScryfall}`);

         // Extraemos los campos que vamos a usar en la vista de carta
        const {name, set_name, rarity, colors, image_uris, legalities, card_faces} = data;
        // Construimos el objeto de respuesta con esos campos
        let oracle_text, type_line;
        if (card_faces && card_faces.length > 0) {
          oracle_text = card_faces[0].oracle_text;
          type_line = card_faces[0].type_line;
        } else {
          oracle_text = data.oracle_text;
          type_line = data.type_line;
        }
                
        const cardDetail ={
          name,
          oracle_text,
          set_name,
          rarity,
          colors,
          type_line,
          image_uris,
          legalities,
        };
      

      const matchingCards = await Card.find({ name: cardDetail.name })
      
      res.status(200).send({selectedCardBack: cardDetail, sameCardsBack: matchingCards})
      //console.log('Detalles de la carta:', cardDetail);
      //console.log('las cartas iguales son:', matchingCards);

    } catch (error) {
      // Manejar errores de base de datos u otros errores
      console.error('Error al buscar los detalles de la carta:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
};



const getRandomCards = async function (req, res, next) {
  const count = parseInt(req.query.count) || 1; // Obtener el valor del parámetro count, si no se proporciona, se asume 1
  const randomCards = await Card.aggregate([{ $sample: { size: count } }]);
  
  const cardData = randomCards.map(({ _id, name, image_uris }) => ({
    _id: _id.toString(),
    name,
    normalImageUrl: image_uris.normal
  }));
  res.status(200).json(cardData);
};

const getSearchedCards = async function (req, res, next) {
  const input = req.query.name
  //console.log(input)
  const regex = new RegExp(input, 'i')
  //console.log(regex)
  const matchingCards = await Card.find({ name: { $regex: regex }})

  if (matchingCards.length > 0) {
    res.status(200).send(matchingCards)
  } else {
    res.status(400).send({error: 'ups, no hay resultados que coincidan'})
  }
}


  const getCardsInCollections = async function (req, res, next) {
    try{
    const input = req.query.name;
    const cardsInCollections = await Card.find({ name: input });
    const collections = cardsInCollections.map(card => card.set_name);
    res.status(200).send(collections)
    }catch{
    res.status(400).send({error: 'Error al obtener las colecciones'})
    }
  }



  const putOnSell = (req, res) => {
     const sellCardData = req.body; 
     sellCard.create([
      {
          id_scryfall: sellCardData.id_scryfall,
          id_card: sellCardData.id_card,
          name: sellCardData.name,
          set_name: sellCardData.set_name,
          lang: sellCardData.lang,
          foil: sellCardData.foil,
          status: sellCardData.status,
          type_sell: sellCardData.type_sell,
          price: sellCardData.price,
          end_of_bid: sellCardData.end_of_bid, 
          user: sellCardData.user,
      }
    ])
    res.send("ok");
  };


  
  const bidUpCard = (req, res) => {    
    const cardToBidData = req.body;
    const cardId = cardToBidData.id_card
    sellCard.findOneAndUpdate(
      { _id: cardId },
      {
        $push: {
          bids: {
            price: cardToBidData.price,
            user: cardToBidData.user,
          },
        },
          $set: {
            price: cardToBidData.price,
          },
        
      },
    )
    .then(() => {
      res.send("ok");
    })
    .catch((error) => {
      console.log("Error al actualizar la carta:", error);
      res.status(500).send("Error al actualizar la carta");
    });
  }
  



  const { ObjectId } = mongoose.Types;

  const buyCard = (req, res) => {
    const selledCardData = req.body;
    const cardId = new ObjectId(selledCardData._id); // Convertir a ObjectId  
    sellCard.updateOne(
      { _id: cardId },
      {
        $set: {
          buyer: selledCardData.buyer,
        },
      }
    )
     .then(() => {
        res.send("ok");
      })
      .catch((error) => {
        console.log("Error al actualizar la carta:", error);
        res.status(500).send("Error al actualizar la carta");
      });
  };


  const onCartCard = async (req, res) => {
  try {
    const onCartCardData = req.body;
    const cardId = new ObjectId(onCartCardData._id);
    const userId = new ObjectId(onCartCardData.onCart);

    console.log("-----------------cardID es:", cardId),
    console.log("-----------------userId es:", userId),

    await sellCard.updateOne(
      { _id: cardId },
      {
        $set: {
          on_cart: onCartCardData.onCart,
        },
      }
    );

    await User.updateOne(
      { _id: userId },
      {
        $push: {
          on_cart: cardId,
        },
      }
    );

    const user = await User.find({ _id: userId })
    const cardsOnCart = user.on_cart
    res.status(200).send({ message: "ok", cardsOnCart});
  } catch (error) {
    console.log("Error al actualizar la carta:", error);
    res.status(500).send("Error al actualizar la carta");
  }
};

  

  const getCardsOnSell = async function (req, res, next) {
    const input = req.query.name;
    const matchingCards = await sellCard.find({  
      $and: [
      { name: input },
      {  $nor: [
        { buyer: { $exists: true } },
        { on_cart: { $exists: true } }
      ] }
      ]
  }).populate("user", "username");
    res.status(200).send(matchingCards);
  } 




module.exports = { createAllCardsSummary, getCardDetail, getRandomCards, getSearchedCards, putOnSell, getCardsOnSell, getCardsInCollections, buyCard, onCartCard, bidUpCard}


