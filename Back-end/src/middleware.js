const jwt = require('jsonwebtoken'); // Módulo NPM
const config = require('./pw.js'); // Ficheiro de configuração
let checkToken = (req, res, next) => {
    try {
      let token = req.headers['x-access-token'] || req.headers['authorization'];
      if (token.startsWith('Bearer ')) {
        token = token.slice(7, token.length); // Remove a palavra 'Bearer '
      }
  
      if (token) {
        jwt.verify(token, config.tokenPassword, (err, decoded) => {
          if (err) {
            return res.json({
              success: false,
              message: 'O token não é válido.'
            });
          } else {
            const senhaAlteradaEm = new Date(decoded.senhaAlteradaEm);
            const tokenEmitidoEm = new Date(decoded.iat * 1000); // Conversão do timestamp UNIX para data
  
            // Verifica se a data da última alteração da senha é posterior à data de emissão do token
            if (senhaAlteradaEm > tokenEmitidoEm) {
                throw new Error('O token é inválido devido à alteração da senha.');
            } else {
              req.decoded = decoded;
              next();
            }
          }
        });
      } else {
        throw new Error('O token é inválido.');
      }
    } catch (error) {
      console.log(error);
      return res.json({
        success: false,
        message: 'Utilizador não identificado!'
      });
    }
  };
  
module.exports = {
    checkToken: checkToken
};
