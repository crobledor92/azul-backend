const express = require('express');
const router = express.Router();
const { createUser, loginUser, getProfile, modifyUser } = require('../../controllers/userController')

/* GET users listing. */
router.post('/register', createUser);

router.post('/login', loginUser)

router.get('/profile', getProfile)

router.put('/profile', modifyUser)

module.exports = router;