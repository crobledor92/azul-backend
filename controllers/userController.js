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

    //Check if username/email and passwords is correct
    if(!loggingInUser || !loggingInUser.comparePassword(password)) { 
        return res.status(400).json({ error: "Las credenciales son incorrectas" })
    } else {
            return res.status(200).json({
                token: await loggingInUser.generateJWT(),
                avatar_image: loggingInUser.avatar_image,
                message: "Te has conectado correctamente"
            })
        }
}

const getProfile = async(req, res) => {

    try {
  
        // request a mongoDB de la data del usuario mediante el id del token decodeado
        const {name, surname, birthdate, address, email, phone, avatar_image, username, _id} = await User.findById(req.decodedToken.id);
        
        //Se guarda la info necesaria en un objeto que se pasa al response
        const userData = {name, surname, birthdate, address, email, phone, avatar_image, username, _id}
        return res.status(200).json(userData)
        
    } catch(error) {
        console.log("Este es el error al verificar el token", error)
        res.status(400).send(error)
    }
}
//// funcion para obtener el nombre de usuario a partir de su ID
/*const getUserNameFromID = async (req, next) => {    
    const userid = req.query.user_id; 
    const nameToGet = await User.find({_id: userid});
    //const username2 = nameToGet[0].username
    console.log ('username es: ', nameToGet[0].username)
    return (nameToGet[0].username)
}*/

const modifyUser = async (req, res) => {

    const userData = await User.findById(req.decodedToken.id)

    console.log("La req body recibida es", req.body)

    //Comprobación de si ya existe un usuario con el username o email al que se está intentando cambiar

    const { email, username} = req.body
    const existingUser = await User.findOne({ 
        $or: [
            {
                _id: { $ne: req.decodedToken.id}, 
                email: email
            },
            {
                _id: { $ne: req.decodedToken.id}, 
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



    //Se crea un objeto con los valores del body y si estos son undifined o null, los que ya existían 
    const newDetails = {
        name: req.body.name || userData.name,
        surname: req.body.surname || userData.surname,
        birthdate: req.body.birthdate || userData.birthdate,
        address: req.body.address || userData.address,
        email: req.body.email || userData.email,
        phone: req.body.phone || userData.phone,
        avatar_image: req.body.avatar_image || userData.avatar_image,
        username: req.body.username || userData.username,
    }
    
    User.findByIdAndUpdate(
        req.decodedToken.id,
        {
            $set: newDetails
        },
        {
            new: true
        }
    )
    .then(updatedStudent => {
        console.log("el usuario modificado es", updatedStudent)
        const { name, surname, birthdate, address, email, phone, avatar_image, username} = updatedStudent
        const updatedData =  { name, surname, birthdate, address, email, phone, avatar_image, username}
        res.status(200).send(updatedData)
    })
    .catch(err => {
        console.log("Err durante la modificación del usuario", err)
        res.status(400).send(err)
    })
    
}

const checkPsswd = async (req, res) => {

    const user = await User.findById(req.decodedToken.id)

    console.log("El user encontrado es", user)

    const { oldPassword: password } = req.body

    console.log(password)

    if( !user.comparePassword(password)) { 
        return res.status(400).json({ error: "Contraseña incorrecta" })
    } else {
        return res.status(200).json({
            message: "La contraseña es correcta"
        })
    }
}

const modifyPsswd = async (req,res) => {

    const { newPassword: password } = req.body

    const hashedPassword = bcrypt.hashSync(password, 10)

    User.findByIdAndUpdate(
        req.decodedToken.id,
        {
            $set: { password: hashedPassword }
        }
    )
    .then(updatedUser => {
        res.status(200).send({messafe: "La contraseña se ha modificado correctamente"})
    })
    .catch(err => {
        res.status(400).json({error: "Ha habido un error durante la modificación de de la contraseña"})
})
}





module.exports = { createUser, loginUser, getProfile, modifyUser, checkPsswd, modifyPsswd }