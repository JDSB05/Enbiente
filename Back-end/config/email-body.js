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

  const contaCriadaPorAdmin = async (email, code) => {
    let mailOptions = {
      from: defaultEmail,
      to: email,
      subject: 'Conta disponível na plataforma',
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
            <h1>Conta criada pela administração</h1>
            <p>Olá! Sua conta na plataforma já está disponível, use o link abaixo para definir sua password.</p>
            <a href="${website}/inserirpass?resetpassword=${code}" class="button">Validar email</a>
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
            <a href="${website}/inserirpass?resetpassword=${code}" class="button">Validar email</a>
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

  async function mandarEmailIndicacao(email, nomeCand, nomeUsuario, nomeVaga) {
    let mailOptions = {
      from: defaultEmail,
      to: email,
      subject: 'Indicação à vaga',
      html: `
        <html>
          <head>
            <style>
              p {
                font-size: 16px;
                font-family: Arial, sans-serif;
              }
              .nome-candidato {
                font-weight: bold;
              }
              .vaga-indicada {
                font-style: italic;
              }
            </style>
          </head>
          <body>
            <p>Olá <span class="nome-candidato">${nomeCand}</span>,</p>
            <p>Você foi indicado para a vaga <span class="vaga-indicada">${nomeVaga}</span> por ${nomeUsuario}.</p>
          </body>
        </html>
      `
    };
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
       // res.status(500).send('Error sending email');
      } else {
        console.log('Email sent: ' + info.response);
       // res.send('Email sent successfully!');
      }
    });
  }

  async function conviteAReuniao(email, nomeUsuario, dataHora, detalhes ) {
    let mailOptions = {
      from: defaultEmail,
      to: email,
      subject: 'Convite a Reunião',
      html: `
        <html>
          <head>
            <style>
              p {
                font-size: 16px;
                font-family: Arial, sans-serif;
              }
              .nome-candidato {
                font-weight: bold;
              }
              .vaga-indicada {
                font-style: italic;
              }
            </style>
          </head>
          <body>
            <p>Olá <span class="nome-candidato">${nomeUsuario}</span>,</p>
            <p>Você foi convidado a participar de uma reunião as ${dataHora}. Mais detalhes:</p>
            <br>
            <p>${detalhes}
          </body>
        </html>
      `
    };
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
       // res.status(500).send('Error sending email');
      } else {
        console.log('Email sent: ' + info.response);
       // res.send('Email sent successfully!');
      }
    });
  }

    async function convocacaoEntrevista(email, nomeUsuario, nomeVaga ) {
      let mailOptions = {
        from: defaultEmail,
        to: email,
        subject: 'Convocação a entrevista de emprego',
        html: `
          <html>
            <head>
              <style>
                p {
                  font-size: 16px;
                  font-family: Arial, sans-serif;
                }
                .nome-candidato {
                  font-weight: bold;
                }
                .vaga-indicada {
                  font-style: italic;
                }
              </style>
            </head>
            <body>
              <p>Olá <span class="nome-candidato">${nomeUsuario}</span>,</p>
              <p>Sua entrevista de emprego para a vaga <span class="vaga-indicada">${nomeVaga}</span> foi confirmada.
              Em breve receberá um email com os detalhes da reunião.</p>
              <br>
              <p>Caso deseja cancelar a entrevista, por favor utilize o link abaixo:
            </body>
          </html>
        `
      };
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
       // res.status(500).send('Error sending email');
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
    contaCriadaPorAdmin,
    conviteAReuniao,
    convocacaoEntrevista
  }