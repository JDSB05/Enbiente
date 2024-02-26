var Sequelize = require('sequelize');


PGHOST='ep-frosty-poetry-a2mu1auo.eu-central-1.aws.neon.tech'
PGDATABASE='HydroCheck'
PGUSER='User'
PGPASSWORD='TRgq03AMWenL'



const sequelize = new Sequelize(
PGDATABASE,
PGUSER,
PGPASSWORD,
{
host: PGHOST,
port: '5432',
dialect: 'postgres',
dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false // Você pode precisar ajustar isso dependendo da configuração do seu ambiente
    }
}
});
module.exports = sequelize;