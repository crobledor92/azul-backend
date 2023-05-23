const User = require('../models/user.model.jsx')

const createUser = (req, res) => {
    User.create([
        {
            name: req.body.name,
            surname: req.body.surname,
            birthdate: req.body.birthdate,
            address: req.body.address,
            email: req.body.email,
            phone: req.body.phone,
            username: req.body.username,
            password: req.body.password,
            deletedAt: req.body.deletedAt,
        }
    ])
        .then(userDoc => {
            console.log(" el usuario registrado es", userDoc)
            res.status(200).send("Usuario creado correctamente")
        })
        .catch(err => {
            console.log(err)
            res.status(400).send(err)
        })
}

module.exports = { createUser }