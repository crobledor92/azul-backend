const { server } = require('../app')
const { Server } = require("socket.io");
const User = require('../models/user.model')
const Conversation = require('../models/conversation.model')
const Message = require('../models/message.model')
const { getUserMessagesData, getConversation, addNewMessage, markAsRead } = require('./socketQuerys')

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
                const userMessagesData = await getUserMessagesData(id)
                io.emit(`inbox_${id}`, {userMessagesData})
            } catch(err) {
                console.log(err)
            }
        });
        socket.on("message", async (message) => {
            try {
                const conversation = await getConversation(message)
                await addNewMessage(message, conversation)
                const senderMessagesData = await getUserMessagesData(message.sender_id)
                io.emit(`inbox_${message.sender_id}`, {userMessagesData: senderMessagesData})
                const receiverMessagesData = await getUserMessagesData(message.receiver_id)
                io.emit(`inbox_${message.receiver_id}`, {userMessagesData: receiverMessagesData})
            } catch(err) {
                console.log(err)
            }
        })
        socket.on("conversationRead", async (conversation) => {
            console.log("el socket recibe la conversación a actualizar", conversation)
            try {
                const senderUserId = await markAsRead(conversation)
                const readerMessagesData = await getUserMessagesData(conversation.reader_id)
                io.emit(`inbox_${conversation.reader_id}`, {userMessagesData: readerMessagesData})
                const senderMessagesData = await getUserMessagesData(senderUserId)
                io.emit(`inbox_${senderUserId}`, {userMessagesData: senderMessagesData})
            } catch (err) {
                console.log(err)
            }
        })
    })
}

module.exports = { websocket }