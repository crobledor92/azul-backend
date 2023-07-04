const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const sellCardSchema = new Schema({
    /* All these come from scryfall. */
    id_scryfall: {type: String, required: false},
    id_card: {type: String, required: false},
    name: {type: String, required: false},
    set_name: {type: String, required: false},


    /* All these come from the user when puts a card on sell. */
    lang: {type: String, required: false},
    foil: {type: Boolean, required: false},
    status: {type: String, required: false},
    type_sell: {type: String, required: false},
    price: {type: String, required: false, mutable: true},
    end_of_bid: {type: String, required: false},
    user: { type: Schema.Types.ObjectId, ref: "User", required: true }, 
    buyer: { type: Schema.Types.ObjectId, ref: "User", required: false }, 
    on_cart: { type: Schema.Types.ObjectId, ref: "User", required: false },
    bids: [{
        price: { type: String, required: false },
        user: { type: Schema.Types.ObjectId, ref: "User", required: false },
        bid_date: {type: Date},
    }]

},
    {timestamps: true}
);



module.exports = mongoose.model("sellCard", sellCardSchema);