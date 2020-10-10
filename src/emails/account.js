const sgMail = require('@sendgrid/mail')

//enviroment variable
sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendWelcomeMail = (email, name)=>{
    sgMail.send({
        to: email,
        from:'l.kotzabasi@gmail.com',
        subject:'Welcome to Task Application',
        text: `Welcome ${name}.  Thank you for joining in! Please do not hasitate to contact us if a problem occurs`
    })

}

const cancellationEmail = (email, name)=>{
    sgMail.send({
        to:email,
        from:'l.kotzabasi@gmail.com',
        subject: 'Cancellation of your Task app account',
        text: `Hello ${name}! Was there any particular problem with the app? Can we help you?`
    })
}
//SEND() returns a promise
// sgMail.send({
//     to:'kotzabasi@hotmail.com',
//     from:'l.kotzabasi@gmail.com',
//     subject: 'Email from node.js',
//     text: 'I hope this email actually gets to you!'
// })
//object in exports because you will export many funtion. sendWelcomeMail (shorthand syntax)
module.exports = {
    sendWelcomeMail,
    cancellationEmail
}