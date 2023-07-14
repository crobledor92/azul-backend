const { all } = require('axios')
const Conversation = require('../models/conversation.model')
const Message = require('../models/message.model')

const newMessage = async (req,res) => {

    console.log("SE ACCEDE A NEW MESSAGE")
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
    let userConversations = await Conversation.find({
        $or: [
            {
                interlocutor1: req.decodedToken.id,
            },
            {
                interlocutor2: req.decodedToken.id,
            }
        ]
    }).populate( 'interlocutor1', ["username", "avatar_image"]).populate( 'interlocutor2', ["username", "avatar_image"])
    
    // console.log("La user conver es", userMessagesData2)

    const allMessages = []
    const promises = userConversations.map(async (conversation) => {
        const messages = await Message.find({conversation_id: conversation._id})
        const messagesSorted = messages.sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt))
        allMessages.push(messagesSorted)
    })
    await Promise.allSettled(promises)

    let userMessagesData = []
    for(let i = 0; i < userConversations.length; i++) {
        for(const messages of allMessages) {
            console.log("El id de la conver es", userConversations[i]._id ,"y el de los mensajes es:", messages[0].conversation_id)
            if (userConversations[i]._id.equals(messages[0].conversation_id)) {
                console.log("SE ACCEDE AL IF")
                userMessagesData.push({
                    conversation: userConversations[i],
                    messages: messages,
                })
            }
        }
    }
    
    const allUserData = {
        userData: req.userData, 
        userMessagesData,
        }

    res.status(200).send(allUserData)

    } catch(err) {
        console.log("Error al traer todas las conversaciones de un usuario", err)
        res.status(400).send({error: "Ha habido un error al traer las conversaciones del usuario"})
    }
}

module.exports = { newMessage, getMessages }