const sendGrid = require('@sendgrid/mail')

sendGrid.setApiKey(process.env.SENDGRID_API_KEY)

exports.sendEmail = async (to, subject, body) => {
    const msgOptions = { 
        to,
        from: 'test@example.com', // Use the email address or domain you verified above
        subject,
        text: 'and easy to do anywhere, even with Node.js',
        html: '<strong>and easy to do anywhere, even with Node.js</strong>',
    };

    try {
        await sendGrid.send(msgOptions)
    } catch (error) {
        console.error(error);

        if (error.response) {
            console.error(error.response.body)
        }
    }
}