const transporter = require("./nodemailer")
const defaultEmail = process.env.EMAIL || 'pint-2023@outlook.com'
const website = process.env.WEBSITE || 'https://enbiente.netlify.app'
const apiwebsite = process.env.APIWEBSITE || 'https://enbiente.onrender.com'

const mailOptions = async () =>{
  let mailOptions = {
  from: defaultEmail, // sender address
  to: 'jesus2santos06@hotmail.com',
  subject: 'Some subject', // Subject line
  html: `<p>test</p>`,
  };// plain text body
  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log('Erro sending email: ' + error);
      //res.status(500).send('Error sending email');
    } else {
      console.log('Email sent: ' + info.response);
      // res.send('Email sent successfully!');
    }
  });
 };

const verificarEmail = async (email, code) => {
    let mailOptions = {
      from: defaultEmail,
      to: email,
      subject: 'Verificação de email',
      html:
        `
       <html>
          <head>
            <style>
              /* Estilos CSS inline */
              body {
                font-family: Arial, sans-serif;
                font-size: 16px;
                line-height: 1.5;
                background-color: #f7f7f7;
              }
              h1 {
                font-size: 28px;
                margin-bottom: 20px;
                color: #444444;
              }
              p {
                margin-bottom: 20px;
                color: #777777;
              }
              .button {
                display: inline-block;
                padding: 12px 24px;
                font-size: 16px;
                font-weight: bold;
                text-decoration: none;
                color: #ffffff;
                background-color: #007bff;
                border-radius: 4px;
                box-shadow: 0 2px 4px rgba(0, 123, 255, 0.4);
              }
            </style>
          </head>
          <body>
            <h1>Verificação de email</h1>
            <p>Olá! Clique no botão abaixo para validar seu endereço de email.</p>
            <a href="${apiwebsite}/api/auth/validaremail?code=${code}" class="button">Validar email</a>
          </body>
        </html>
        `
    };
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log('Erro sending email: ' + error);
        //res.status(500).send('Error sending email');
      } else {
        console.log('Email sent: ' + info.response);
        // res.send('Email sent successfully!');
      }
    });
  }

  const resetPassword = async (email, code) => {
    let mailOptions = {
      from: defaultEmail,
      to: email,
      subject: 'Redefinir password',
      html:
        `
       <html>
          <head>
            <style>
              /* Estilos CSS inline */
              body {
                font-family: Arial, sans-serif;
                font-size: 16px;
                line-height: 1.5;
                background-color: #f7f7f7;
              }
              h1 {
                font-size: 28px;
                margin-bottom: 20px;
                color: #444444;
              }
              p {
                margin-bottom: 20px;
                color: #777777;
              }
              .button {
                display: inline-block;
                padding: 12px 24px;
                font-size: 16px;
                font-weight: bold;
                text-decoration: none;
                color: #ffffff;
                background-color: #007bff;
                border-radius: 4px;
                box-shadow: 0 2px 4px rgba(0, 123, 255, 0.4);
              }
            </style>
          </head>
          <body>
            <h1>Redefinir password</h1>
            <p>Olá! Aceda ao link para redefinir a password</p>
            <a href="${website}/recuperarpassword?resetpassword=${code}" class="button">Validar email</a>
          </body>
        </html>
        `
    };
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log('Erro sending email: ' + error);
        //res.status(500).send('Error sending email');
      } else {
        console.log('Email sent: ' + info.response);
        // res.send('Email sent successfully!');
      }
    });
  }

  const enviarAlerta = async (email, code) => {
    let mailOptions = {
      from: defaultEmail,
      to: email,
      subject: 'Alerta de consumo',
      html:
        `
       <html>
          <head>
            <style>
              /* Estilos CSS inline */
              body {
                font-family: Arial, sans-serif;
                font-size: 16px;
                line-height: 1.5;
                background-color: #f7f7f7;
              }
              h1 {
                font-size: 28px;
                margin-bottom: 20px;
                color: #444444;
              }
              p {
                margin-bottom: 20px;
                color: #777777;
              }
              .button {
                display: inline-block;
                padding: 12px 24px;
                font-size: 16px;
                font-weight: bold;
                text-decoration: none;
                color: #ffffff;
                background-color: #007bff;
                border-radius: 4px;
                box-shadow: 0 2px 4px rgba(0, 123, 255, 0.4);
              }
            </style>
          </head>
          <body>
            <h1>Alerta de consumo</h1>
            <p>Olá! Aceda ao link para verificar o consumo</p>
            <a href="${website}" class="button">Verificar consumo</a>
          </body>
        </html>
        `
    };
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log('Erro sending email: ' + error);
        //res.status(500).send('Error sending email');
      } else {
        console.log('Email sent: ' + info.response);
        // res.send('Email sent successfully!');
      }
    });
  }

  module.exports =
  {
    mailOptions,
    resetPassword,
    verificarEmail,
    enviarAlerta
  }