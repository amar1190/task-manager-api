const sgMail = require('@sendgrid/mail')

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const welcomeText = `

Welcome to the Task Manager application. We would love to hear your experience using our product.

Regards,
Amar S
`
const goodByeText = `

We are sad to see you GO. Please let us know what went wrong.

Regards,
Amar S`

const sendWelcomeEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'amarpreetsingh1109@gmail.com',
        subject: 'Welcome to Task-Manager. Thanks!',
        text: `Hi ${name}, ${welcomeText}`
    })
}

const sendCancellationEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'amarpreetsingh1109@gmail.com',
        subject: 'Sorry to see you go!',
        text: `Hi ${name}, ${goodByeText}`
    })
}

module.exports = {
    sendWelcomeEmail,
    sendCancellationEmail
}