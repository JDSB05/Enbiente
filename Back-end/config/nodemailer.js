const nodemailer = require('nodemailer');
const defaultEmail = process.env.EMAIL || 'pint-2023@outlook.com'
const passEmail = process.env.EMAILPASS || 'quevenhao20'

let transporter = nodemailer.createTransport({
    host: 'smtp-mail.outlook.com',
    port: 587,
    secure: false,
    auth: {
        user: defaultEmail,
        pass: passEmail
    }
});



module.exports = transporter