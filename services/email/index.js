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

module.exports = { welcomeEmail }