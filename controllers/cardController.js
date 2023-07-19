const User = require('../models/user.model')
const Card = require('../models/card.model');
const axios =require ('axios')
const sellCard = require('../models/sellcard.model');
const mongoose = require('mongoose');
const { notSelledEmail,selledSellerEmail, selledBuyerEmail } = require('../services/email')
const SibApiV3Sdk = require('sib-api-v3-sdk');


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
     console.log('cardController.js 129 | sell card data', sellCardData);
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
          image: sellCardData.image
      }
    ])
    res.send("ok");
  };


  
  const bidUpCard = (req, res) => {    
    const cardToBidData = req.body;
    console.log(req.body)
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

  const deleteCardFromCart = async (req, res) => {
    try {
      const cardId = new ObjectId(req.body._id);
      const userId = new ObjectId(req.decodedToken.id);
      
      await sellCard.updateOne(
        { _id: cardId },
        {
          $unset: {
            on_cart: userId,
          },
        }
      );
  
      await User.updateOne(
        { _id: userId },
        {
          $pull: {
            on_cart: cardId,
          },
        }
      );
      res.status(200).send({ message: "ok" });
    } catch (error) {
      console.log("Error al eliminar una carta del carrito de usuario", error)
      res.status(400).send("Error al eliminar la carta del carrito");
    }
  }

  const buyCardsOnCart = async (req, res) => {
    try {
      const userId = new ObjectId(req.decodedToken.id);
      const user = await User.findById(userId);
      const userCart = user.on_cart 

       const promises = userCart.map(async card => {
        console.log(card)
        await sellCard.updateOne(
          { _id: card },
          {
            $set: {
              buyer: userId,
            },
            $unset: {
              on_cart: userId,
            },
          }
        )

        await User.updateOne(
          { _id: userId },
          {
            $pull: {
              on_cart: card,
            },
          }
        )       
      })  
      await Promise.allSettled(promises)
      res.status(200).send({message: "OK"})
    } catch(error) {
      console.log(error)
      res.status(400).send({error: "Ha habido un error al comprar las cartas del carrito"})
    }
  }

  

  const getCardsOnSell = async function (req, res, next) {
    const input = req.query.name;
    const matchingCards = await sellCard.find({  
      $and: [
      { name: input },
      {  $nor: [
        { buyer: { $exists: true } },
        { on_cart: { $exists: true } },
        { expired: { $exists: true } },
        { deletedAt: { $exists: true } },

      ] }
      ]
  }).populate("user", "username");
    res.status(200).send(matchingCards);
  } 


  ///////OBTENEMOS LAS CARTAS EXPIRADAS***** 
  const getEndOfBidCards = async function (req, res) {
    const currentDate = new Date();
  
    const matchingCards = await sellCard.find({
      type_sell: "Subasta",
      end_of_bid: { $lte: currentDate },
      //end_of_bid: "2023-07-11T22:00:00.000Z", // para probar, eliminar después y descomentar línea de arriba
      buyer: { $exists: false },
      expired: { $exists: false },
      
    });
    for (const card of matchingCards) {
      if (card.bids.length < 1) {
        console.log("quitar la carta de venta");
        await sellCard.updateOne(
          { _id: card._id },
          {
            $set: {
              expired: true,
            },
          }
        );
        const populatedCard = await sellCard.findById(card._id).populate('user');
        const userEmail = populatedCard.user.email;
        const userName = populatedCard.user.username;
        SibApiV3Sdk.ApiClient.instance.authentications['api-key'].apiKey = process.env.BREVO_API_DAVID;
        new SibApiV3Sdk.TransactionalEmailsApi().sendTransacEmail(notSelledEmail(userName,userEmail))
               
      } else {
        console.log("adjudicarla al mayor pujador");
        const bidsAmount = card.bids.length - 1;
         await sellCard.updateOne(
            { _id: card._id },
            {
              $set: {
                buyer: card.bids[bidsAmount].user,
              },
            }
          );
        const sellerInfo = await sellCard.findById(card._id).populate('user');
        //console.log ("SellerInfoes:",sellerInfo)
        const sellerEmail = sellerInfo.user.email;
        const sellerName = sellerInfo.user.username;
        SibApiV3Sdk.ApiClient.instance.authentications['api-key'].apiKey = process.env.BREVO_API_DAVID;
        new SibApiV3Sdk.TransactionalEmailsApi().sendTransacEmail(selledSellerEmail(sellerName,sellerEmail))

        const buyerInfo = await sellCard.findById(card._id).populate('buyer');
        console.log("Buyerinfo es:", buyerInfo)
        const buyerEmail = buyerInfo.buyer.email;
        const buyerName = sellerInfo.buyer.username;
        SibApiV3Sdk.ApiClient.instance.authentications['api-key'].apiKey = process.env.BREVO_API_DAVID;
        new SibApiV3Sdk.TransactionalEmailsApi().sendTransacEmail(selledBuyerEmail(buyerName,buyerEmail))
      }
    };
  
    res.status(200).send(matchingCards);
  };

  const delCard = (req, res) => {
    const currentDate = new Date();
    const delCardData = req.body;
    const cardId = new ObjectId(delCardData._id); // Convertir a ObjectId  

    //db.collection('sellcards').deleteOne({ _id: cardId })
    sellCard.updateOne(
      { _id: cardId },
      {
        $set: {
          deletedAt: currentDate,
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

  
module.exports = { createAllCardsSummary, getCardDetail, getRandomCards, getSearchedCards, putOnSell, getCardsOnSell, getCardsInCollections, buyCard, onCartCard, bidUpCard, buyCardsOnCart, deleteCardFromCart, getEndOfBidCards, delCard}


