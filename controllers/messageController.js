const Conversation = require('../models/conversation.model')
const Message = require('../models/message.model')

const newMessage = async (req,res) => {

    try {
        const existingConversation = await Conversation.findOne({
            $or: [
                {
                    interlocutor1: req.decodedToken.id,
                    interlocutor2: req.body.receiver,
                },
                {
                    interlocutor1: req.body.receiver,
                    interlocutor2: req.decodedToken.id,
                    
                }
            ]
        })

        if(existingConversation) {
            await Message.create([
                {
                    conversation_id: existingConversation._id,
                    sender: req.decodedToken.id,
                    message: req.body.message,
                }
            ])
            res.status(200).send({message: "Se ha guardado el nuevo mensaje de la conversación existente"})
        } else {
            const newConversation = new Conversation(
                {
                    interlocutor1: req.decodedToken.id,
                    interlocutor2: req.body.receiver,
                }   
            )
            const savedConversation = await newConversation.save()
            await Message.create([
                {
                    conversation_id: savedConversation._id,
                    sender: req.decodedToken.id,
                    message: req.body.message,
                }
            ])
            res.status(200).send({message: "Se ha creado una nueva conversación y guardado el primer mensaje"})
        }
    } catch(err) {
        console.log("error al enviar el mensaje", err)
        res.status(400).send("Ha habido un error al enviar el mensaje")
    }
}

const getMessages = async (req,res) => {

    try {
    const userConversations = await Conversation.find({
        $or: [
            {
                interlocutor1: req.decodedToken.id,
            },
            {
                interlocutor2: req.decodedToken.id,
            }
        ]
    })

    const promises = userConversations.map(async (conversation) => {
        const messages = await Message.find({conversation_id: conversation._id})

        conversation = {...conversation, messages: messages}
        return conversation
    })
    await Promise.allSettled(promises)

    res.status(200).send(userConversations)

    } catch(err) {
        console.log("Error al traer todas las conversaciones de un usuario", err)
        res.status(400).send({error: "Ha habido un error al traer las conversaciones del usuario"})
    }
}

module.exports = { newMessage, getMessages }