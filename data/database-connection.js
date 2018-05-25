"use strict";
exports.__esModule = true;
var sequelize_1 = require("sequelize");
var sequelize = new sequelize_1.Sequelize('videoLibraryDB', null, null, {
    dialect: 'sqlite',
    operatorsAliases: false,
    storage: './database.sqlite'
});
exports["default"] = sequelize;
