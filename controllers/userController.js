const User = require('../models/user.model')
const jwt = require('jsonwebtoken');
const secret = process.env.JWT_SECRET;
const bcrypt = require('bcrypt');

const createUser = async (req, res) => {
    
    console.log(req.body.name)
    //Check all the required fields are filled
    const propertryNames = ["name", "birthdate", "email",  "username", "password"] //Required fields
    const keyValuesArray = Object.entries(req.body)
    let emptyFields = false
        
    propertryNames.forEach(e => {
        if (!keyValuesArray.flat(1).includes(e) || req.body.e == "") {
            console.log("llegamos hasta aquí")
             return emptyFields = true;
        }
    })

    if (emptyFields) {
        return res.status(400).json({error: "Falta por rellenar algun campo requerido"})
    }
    

    // check if there is a user registered with this email or username
    const { email, username, password} = req.body
    const takenCredentials = {}
    const existingUser = await User.findOne({
        $or: [
            {
                email: email
            },
            {
                username: username
            }
        ]
    })
    if(existingUser) {
        if(existingUser.email == email) {
            return res.status(400).json({error: "El email ya estaba registrado" }) 
        }
        if(existingUser.username == username) {
            return res.status(400).json({error: "El usuario ya estaba cogido...prueba uno distinto" })
        }  
    } 

    const hashedPassword = bcrypt.hashSync(password, 10)

    const newUser = new User(
        {
            name: req.body.name,
            surname: req.body.surname,
            birthdate: req.body.birthdate,
            address: req.body.address,
            email: req.body.email,
            phone: req.body.phone,
            username: req.body.username,
            password: hashedPassword,
            deletedAt: req.body.deletedAt,
        }
    )
    const savedUser = await newUser.save()
    if(savedUser) {
        return res.status(201).json({
            token: await savedUser.generateJWT(), //JWT created through the User model method
            user: {
                email: savedUser.email,
                username: savedUser.username,
                _id: savedUser._id
            },
            message:"Usuario creado correctamente",
        })
    } else {
        console.log("se retorna este ERROOOOOOOOOOOOOOOOOOOOR")
        return res.status(400).json({error: "Ha habido un error al crear un nuevo usuario", err})

    }
}

const loginUser = async (req,res) => {
    const { userCredential, password } = req.body

    //Check if Credential fields are filled
    if(userCredential == null || password == null ) { 
        return res.status(400).json({ error: "Ingrese nombre de usuario o email y contraseña" })
    }

    const loggingInUser = await User.findOne({
        $or: [{ email: userCredential }, { username: userCredential }] 
    })

    //Check if username/email is correct
    if(!loggingInUser || !loggingInUser.comparePassword(password)) { 
        return res.status(400).json({ error: "Las credenciales son incorrectas" })
    } else {
            return res.status(200).json({
                token: await loggingInUser.generateJWT(),
                message: "Te has conectado correctamente"
            })
        }

    //Check if password is correct
    // if (!loggingInUser.comparePassword(password)) {
    //     return res.status(400).json({ error: "La contraseña no es correcta" })
    // } else {
    //     return res.status(200).json({
    //         token: await loggingInUser.generateJWT(),
    //         message: "Te has conectado correctamente"
    //     })
    // }
}

const getProfile = async(req, res) => {
    const token = req.headers.authorization.split(" ")[1]
    console.log("El token es: ", token)

    //TODO: Se debe enviar la info necesaria del usuario que se mostrará en el perfil del usuario
    try {
        const decodedToken = jwt.verify(token, secret)
        const userDataFromDecodedToken = decodedToken;
        console.log('user data', 
        userDataFromDecodedToken.email,
        userDataFromDecodedToken.username
        );
        
        const userDataFromMongoDBQuerry = await User.findOne({
            $or: [{ email: userDataFromDecodedToken.email }, 
                { username: userDataFromDecodedToken.username }
            ],
        });
        // request a mongoDB de la data del usuario
        
        
        return res.status(200).json({userDataFromMongoDBQuerry})
        console.log("el token decodeado es: ", decodedToken)
        return res.status(200).send("Has accedido correctamente")
    } catch(error) {
        console.log("Este es el error al verificar el token", error)
        res.status(400).send(error)
    }
    

    
    
}

        


module.exports = { createUser, loginUser, getProfile }