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

//     .populate({
//         path    : 'users',
//         populate: [
//             { path: 'cars' },
//             { path: 'houses' }
//         ]
//    });


    console.log("las conversaciones con el username son", userConversations)
    
    const allMessages = []
    const promises = userConversations.map(async (conversation) => {
        const messages = await Message.find({conversation_id: conversation._id})
        allMessages.push(messages)
    })
    await Promise.allSettled(promises)

    // let unreadConversationsCount = 0
    const userMessagesData = userConversations.map((conversation, index) => {
        // let allMessagesRead = true
        // const relatedMessages = allMessages[index]
        // relatedMessages.forEach(message => !message.read ? allMessagesRead = false : null)
        const conversationAndMessages = {
            conversation,
            messages: allMessages[index],
            // read: allMessagesRead,
        }
        // !conversationAndMessages.read ? unreadConversationsCount++ : null
        console.log("conversación completa", conversationAndMessages)
        return conversationAndMessages
    })
    
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