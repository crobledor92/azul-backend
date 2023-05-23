const express = require('express');
const router = express.Router();
const { createUser } = require('../../controllers/userController.jsx')

/* GET users listing. */
router.post('/register', createUser);

module.exports = router;