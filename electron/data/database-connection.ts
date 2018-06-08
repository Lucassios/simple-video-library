import { app } from 'electron';
import { Sequelize } from 'sequelize';

const sequelize = new Sequelize('videoLibraryDB', null, null, {
    dialect: 'sqlite',
    operatorsAliases: false,
    // storage: ':memory:'
    storage: app.getPath('userData') + '/database.sqlite'
  });

export default sequelize;