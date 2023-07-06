const express = require('express');
const router = express.Router();
const { newMessage, getMessages } = require('../../controllers/messageController')
const { tokenValidator } = require('../../middlewares/tokenValidator')

/* GET users listing. */
router.get('/messages', tokenValidator, getMessages );

router.post('/sendmessage', tokenValidator, newMessage);

module.exports = router;