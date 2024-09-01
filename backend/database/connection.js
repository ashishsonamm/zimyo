if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}

const Sequelize = require("sequelize");
const config = require("../config/db");

const sequelize = new Sequelize(
    config.database,
    config.user,
    config.password,
    {
        host: config.host,
        dialect: "mysql",
        logging: console.log 
    }
);

module.exports = sequelize;
