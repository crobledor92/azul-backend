const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema({
    /* All these come from scryfall. */
    id: {type: String, required: true},
    name: {type: String, required: true},
    released_at: {type: Date, required: true},
    image_uris: {
        small: {type: String, required: true},
        normal: {type: String, required: true},
    },
    mana_cost: {type: String, required: true},
    cmc: {type: String, required: true},
    type_line: {type: String, required: true},
    oracle_text: {type: String, required: true},
    power: {type: String, required: false},
    toughness: {type: String, required: false},
    colors: {type: Array, required: true},
    legalities: {
        standard: {type: String, required: true},
        pioneer: {type: String, required: true},
        modern: {type: String, required: true},
        legacy: {type: String, required: true},
        pauper: {type: String, required: true},
        vintage: {type: String, required: true},
        commander: {type: String, required: true},
        premodern: {type: String, required: true},
        predh: {type: String, required: true},
    },
    //set_id: {type: String, required: true},
    //set: {type: String, required: true},
    //set_name: {type: String, required: true},
    //collector_number: {type: Number, required: true},
    rarity: {type: String, required: true},
    artist: {type: String, required: true},

    /* All these come from the user when puts a card on sell. */
    lang: {type: String, required: true},
    foil: {type: Boolean, required: true},
    status: {type: String, required: true},
    type_sell: {type: String, required: true},
    price: {type: String, required: true},
    end_of_bid: {type: Date, required: false},
    user: {type: String, required: true},
    set_id: {type: String, required: true},
},
    {timestamps: true}
);



module.exports = mongoose.model("Card", userSchema);