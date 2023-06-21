const express = require('express');
const router = express.Router();
const { createUser, loginUser, getProfile, modifyUser, checkPsswd, modifyPsswd } = require('../../controllers/userController')
const { tokenValidator } = require('../../middlewares/tokenValidator')

/* GET users listing. */
router.post('/register', createUser);

router.post('/login', loginUser)

router.get('/profile', tokenValidator, getProfile)

router.put('/profile/modify_details', tokenValidator, modifyUser)

router.put('/profile/check_psswd', tokenValidator, checkPsswd)

router.put('/profile/modify_psswd', tokenValidator, modifyPsswd)





module.exports = router;