const Conversation = require('../models/conversation.model')
const Message = require('../models/message.model')


const getUserMessagesData = async (id) => {
    let userConversations = await Conversation.find({
        $or: [
            {
                interlocutor1: id,
            },
            {
                interlocutor2: id,
            }
        ]
    }).populate( 'interlocutor1', ["username", "avatar_image"]).populate( 'interlocutor2', ["username", "avatar_image"])

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
            if (userConversations[i]._id.equals(messages[0].conversation_id)) {
                userMessagesData.push({
                    conversation: userConversations[i],
                    messages: messages,
                })
            }
        }
    }

    userMessagesData = userMessagesData.sort((a,b) => b.messages[0].createdAt - a.messages[0].createdAt)
    
    return userMessagesData
}

const getConversation = async (message) => {
    const existingConversation = await Conversation.findOne({
        $or: [
            {
                interlocutor1: message.sender_id,
                interlocutor2: message.receiver_id,
            },
            {
                interlocutor1: message.receiver_id,
                interlocutor2: message.sender_id,
                
            }
        ]
    })

    if(existingConversation) {
        return existingConversation
    } else {
        const newConversation = new Conversation(
            {
                interlocutor1: message.sender_id,
                interlocutor2: message.receiver_id,
            }   
        )
        const savedConversation = await newConversation.save()
        return savedConversation
    }
}

const addNewMessage = async (message, conversation) => {
    await Message.create([
        {
            conversation_id: conversation._id,
            sender: message.sender_id,
            message: message.text,
        }
    ])
}

const markAsRead = async (conversation) => {
    const messages = await Message.find({
        conversation_id: conversation.conversation_id,
        sender: { $ne : conversation.reader_id }
    })
    const promises = messages.map(async message => {
        await Message.updateOne(
          { _id: message._id },
          {
            $set: {
              read: true,
            },
          }
        )
    })
    await Promise.allSettled(promises)

    const senderUserId = messages[0].sender.toString()
    return senderUserId
}

module.exports = { getUserMessagesData, getConversation, addNewMessage, markAsRead }