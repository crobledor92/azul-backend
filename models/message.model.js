const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const messageSchema = new Schema({

    conversation_id: { type: Schema.Types.ObjectId, ref: "Conversation", required: true },
    sender: { type: Schema.Types.ObjectId, ref: "User", required: true },
    message: { type: String, required: true },
    read: { type: Boolean, required: true, default: false },
},
    {timestamps: true}
);

module.exports = mongoose.model("Message", messageSchema);