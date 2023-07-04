const express = require('express');
const router = express.Router();
const { createUser, loginUser, tokenValidatorRes, getUserData, modifyUser, checkPsswd, modifyPsswd } = require('../../controllers/userController')
const { tokenValidator } = require('../../middlewares/tokenValidator')

/* GET users listing. */
router.get('/homepage', tokenValidator);

router.post('/register', createUser);

router.post('/login', loginUser);

router.get('/userTokenValidation', tokenValidator, tokenValidatorRes)

router.get('/getUserData', tokenValidator, getUserData)

router.put('/profile/modify_details', tokenValidator, modifyUser)

router.put('/profile/check_psswd', tokenValidator, checkPsswd)

router.put('/profile/modify_psswd', tokenValidator, modifyPsswd)





//router.get('/username', getUserNameFromID)

module.exports = router;