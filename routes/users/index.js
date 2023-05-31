const express = require('express');
const router = express.Router();
const { createUser, loginUser, getProfile } = require('../../controllers/userController')

/* GET users listing. */
router.post('/register', createUser);

router.post('/login', loginUser)

router.get('/myProfile', getProfile)

module.exports = router;