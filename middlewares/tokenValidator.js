const jwt = require('jsonwebtoken');
const secret = process.env.JWT_SECRET;

const tokenValidator = async (req, res, next) => {
    const token = req.headers.authorization.split(" ")[1]

    jwt.verify(token, secret, function(err, decoded) {
        if(err) {
            console.log("el error es ", err)
            res.status(400).send(err)
        } else {
            console.log("el token es------------------", decoded)
            req.decodedToken = decoded
            next()
        }
    })    
}

module.exports = { tokenValidator }