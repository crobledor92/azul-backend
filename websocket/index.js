const { server } = require('../app')
const { Server } = require("socket.io");
const axios =require ('axios')
const mongoose = require('mongoose');
const User = require('../models/user.model')
const Conversation = require('../models/conversation.model')
const Message = require('../models/message.model')

const websocket = () => {
    const io = new Server(server, {
      cors: {
        origin: '*',
        methods: ['GET', 'POST'],
      },
    });
    
    io.on('connection', (socket) => {
        io.emit("message", "bienvenido de nuevo")
        socket.on("id", async (id) => {
            try {
                let userConversations = await Conversation.find({
                    $or: [
                        {
                            interlocutor1: id,
                        },
                        {
                            interlocutor2: id,
                        }
                    ]
                })
                io.emit(`inbox_${id}`, {inbox: userConversations})
                for(const conversation of userConversations) {
                    socket.on(`${conversation._id}`, (message) => {

                        io.emit(`${conversation._id}`, message.text)
                    })
                }
                // console.log("Las conversaciones son", userConversations)
            } catch(err) {
                console.log(err)
            }
        });
    })
}

module.exports = { websocket }