// import { Sequelize } from 'sequelize';
// import { Pool } from 'pg';

// const pool = new Pool({
//   user: 'postgres',
//   host: 'localhost',
//   database: 'cockpit_new',
//   password: 'root',
//   port: 5432,
// });

// const sequelize = new Sequelize('cockpit_new', 'postgres', 'root', {
//   // host: 'localhost',
//   dialect: 'postgres',
//   dialectModule: () => pool,
// });

// export default sequelize;


import { Sequelize } from 'sequelize';
import pg from 'pg';

const sequelize = new Sequelize(process.env.DB!, process.env.DB_USERNAME!, process.env.DB_PASSWORD!, {
  host: 'localhost',
  dialect: 'postgres',
  dialectModule: pg,
});

export default sequelize;