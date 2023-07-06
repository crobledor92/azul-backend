const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const conversationSchema = new Schema({

    interlocutor1: { type: Schema.Types.ObjectId, ref: "User", required: true },
    interlocutor2: { type: Schema.Types.ObjectId, ref: "User", required: true },
},
    {timestamps: true}
);

module.exports = mongoose.model("Conversation", conversationSchema);