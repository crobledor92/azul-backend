const User = require('../models/card.model')
const Card = require('../models/card.model');
const axios =require ('axios')


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
      const {name, oracle_text, set_name, rarity, colors, type_line, image_uris, legalities} = data;
      // Construimos el objeto de respuesta con esos campos
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
      
      console.log('Detalles de la carta:', cardDetail);
      res.status(200).json(cardDetail);

      // Construir el objeto de respuesta con el id_scryfall de la carta
      //const cardDetail = {
        //id_scryfall: idScryfall, 
        // Agregar más propiedades de la carta según tus necesidades
      //};
  
      //res.status(200).json(cardDetail);
      //console.log('Detalles de la carta:', cardDetail);
    } catch (error) {
      // Manejar errores de base de datos u otros errores
      console.error('Error al buscar los detalles de la carta:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
};

module.exports = { createAllCardsSummary, getCardDetail }

