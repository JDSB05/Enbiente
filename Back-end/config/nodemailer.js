const nodemailer = require('nodemailer');
const defaultEmail = process.env.EMAIL || 'enbiente@zohomail.eu'
const passEmail = process.env.EMAILPASS || 'Palavrapasse1'

let transporter = nodemailer.createTransport({
    host: 'smtp.zoho.eu',
    port: 587,
    secure: false,
    auth: {
        user: defaultEmail,
        pass: passEmail
    }
});



module.exports = transporter