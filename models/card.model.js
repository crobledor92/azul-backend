const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const cardSchema = new Schema({
    /* All these come from scryfall. */
    id_scryfall: {type: String, required: true},
    name: {type: String, required: true},
    image_uris: {
        small: {type: String, required: true},
        normal: {type: String, required: true},
    },
    mana_cost: {type: String},
    cmc: {type: String},
    type_line: {type: String},
    oracle_text: {type: String},
    power: {type: String},
    toughness: {type: String},
    colors: {type: Array},
    legalities: {
        standard: {type: String},
        pioneer: {type: String},
        modern: {type: String},
        legacy: {type: String},
        pauper: {type: String},
        vintage: {type: String},
        commander: {type: String},
    },
    //set_id: {type: String, required: true},
    set: {type: String, required: true},
    set_name: {type: String, required: true},
    //collector_number: {type: Number, required: true},
    rarity: {type: String},
    artist: {type: String},

    /* All these come from the user when puts a card on sell. */
    // lang: {type: String, required: true},
    // foil: {type: Boolean, required: true},
    // status: {type: String, required: true},
    // type_sell: {type: String, required: true},
    // price: {type: String, required: true},
    // end_of_bid: {type: Date, required: false},
    // user: {type: String, required: true},
    // set_id: {type: String, required: true},
},
    {timestamps: true}
);



module.exports = mongoose.model("Card", cardSchema);