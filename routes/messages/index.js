const express = require('express');
const router = express.Router();
const { newMessage, getMessages, updateMessages } = require('../../controllers/messageController')
const { tokenValidator } = require('../../middlewares/tokenValidator')

/* GET users listing. */
router.get('/messages', tokenValidator, getMessages );

router.post('/sendmessage', tokenValidator, newMessage);

router.put('/updateMessages', tokenValidator, updateMessages)

module.exports = router;