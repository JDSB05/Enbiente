
//const { Sequelize } = require('sequelize');

//const sequelize = new Sequelize('pint_mg2y', 'pint_mg2y_user', 'zuR4iWpzSynPmyJhENBQEaXREo00rmtN', {
 // dialect: 'postgres',
 // host: process.env.HOSTDB || 'dpg-ch6jhc02qv26p18pd88g-a.frankfurt-postgres.render.com',
//  port: 5432,
//  dialectOptions: {
 //   ssl: {
 //     require: true,
//      rejectUnauthorized: false,
//    },
//}
//}
//);


const Sequelize = require('sequelize');
const fs = require('fs');
const sequelize = new Sequelize({
  database: process.env.DATABASE,
  username: process.env.USER,
  password: process.env.PASSWORD,
  host: process.env.HOST,
  port: process.env.DATABASE_PORT,
  dialect: 'postgres',
  dialectOptions: {
    ssl: {
      ca: fs.readFileSync('DigiCertGlobalRootCA.crt.pem')
    }
  }
});
(async () => {
  await sequelize.sync();
  console.log('All models were synchronized successfully.');
  

})();

//sequelize.sync()
//    .then(() => console.log('Tabelas criadas com sucesso'))
//    .catch(error => console.error(error));


module.exports = sequelize;