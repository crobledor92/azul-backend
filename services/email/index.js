const welcomeEmail = (name, email) => {
    return (
        {
            'subject':'Bienvenido a FreakyWolrd',
            'sender' : {'email':'freakyworld.nuclio@gmail.com', 'name':'FreakyWorld'},
            'replyTo' : {'email':'freakyworld.nuclio@gmail.com', 'name':'FreakyWorld'},
            'to' : [{'name':`${name}`, 'email':`${email}`}],
            "templateId": 1,
            'params' : {
                "contact": {
                    'NOMBRE':`${name}`,
                },
            }
        }
    )
}

const notSelledEmail = (name, email) => {
    return (
        {
            
            'subject':'Carta No vendida',
            'sender' : {'email':'daviddiezalvarez@gmail.com', 'name':'FreakyWorld'},
            'replyTo' : {'email':'daviddiezalvarez@gmail.com', 'name':'FreakyWorld'},
            'to' : [{'name':`${name}`, 'email':`${email}`}],
            "templateId": 3,
            'params' : {
                "contact": {
                    'NOMBRE':`${name}`,
                },
            }
        }
    )
}

const selledBuyerEmail = (name, email) => {
    return (
        {
            
            'subject':'Carta Comprada',
            'sender' : {'email':'daviddiezalvarez@gmail.com', 'name':'FreakyWorld'},
            'replyTo' : {'email':'daviddiezalvarez@gmail.com', 'name':'FreakyWorld'},
            'to' : [{'name':`${name}`, 'email':`${email}`}],
            "templateId": 5,
            'params' : {
                "contact": {
                    'NOMBRE':`${name}`,
                },
            }
        }
    )
}

const selledSellerEmail = (name, email) => {
    return (
        {
            
            'subject':'Carta Vendida',
            'sender' : {'email':'daviddiezalvarez@gmail.com', 'name':'FreakyWorld'},
            'replyTo' : {'email':'daviddiezalvarez@gmail.com', 'name':'FreakyWorld'},
            'to' : [{'name':`${name}`, 'email':`${email}`}],
            "templateId": 4,
            'params' : {
                "contact": {
                    'NOMBRE':`${name}`,
                },
            }
        }
    )
}


module.exports = { welcomeEmail, notSelledEmail, selledBuyerEmail ,selledSellerEmail }