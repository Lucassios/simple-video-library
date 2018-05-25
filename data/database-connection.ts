import { Sequelize } from 'sequelize';

const sequelize = new Sequelize('videoLibraryDB', null, null, {
    dialect: 'sqlite',
    operatorsAliases: false,
    storage: './database.sqlite'
  });

export default sequelize;