import { app } from 'electron';
import * as SequelizeStatic from 'sequelize';

if (process.env.NODE_ENV == 'test') {
  var storage = ':memory:';
} else {
  var storage = app.getPath('userData') + '/database.sqlite';
}

const sequelize = new SequelizeStatic('videoLibraryDB', null, null, {
    dialect: 'sqlite',
    operatorsAliases: false,
    // storage: ':memory:'
    storage
});

export default sequelize;
