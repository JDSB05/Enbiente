
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('pint_mg2y', 'pint_mg2y_user', 'zuR4iWpzSynPmyJhENBQEaXREo00rmtN', {
  dialect: 'postgres',
  host: process.env.HOSTDB || 'dpg-ch6jhc02qv26p18pd88g-a.frankfurt-postgres.render.com',
  port: 5432,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
}
}
);

(async () => {
  await sequelize.sync();
  console.log('All models were synchronized successfully.');
})();


module.exports = sequelize;