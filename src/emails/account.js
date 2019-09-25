const sgMail = require('@sendgrid/mail')


sgMail.setApiKey(process.env.SENDGRID_API_KEY)


const sendWelcomeEmail = (email, name) =>{
    sgMail.send({
        to: email,
        from: 'pclement803@gmail.com',
        subject: 'Thanks for Joining!',
        text: 'Welcome to the Clement Task App, ' + name + '. Let me know how you like the app!'
    })
}


const sendFollowUpEmail = (email, name) =>{
    sgMail.send({
        to: email,
        from: 'pclement803@gmail.com',
        subject: 'We are sorry to see you go :(',
        text: `We are sorry to you leave ${name}. If you are willing, we would love to get your feedback on why you left, and how we can improve our user experience.`
    })
}
module.exports = {
    sendWelcomeEmail,
    sendFollowUpEmail
}