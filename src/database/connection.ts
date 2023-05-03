import { Sequelize } from "sequelize";
import { database } from "../config/database.config";

//create db connection
export const sequelize = new Sequelize({
    dialect: 'mysql',
    host: database.host,
    username: database.username,
    password: database.password,
    database: database.db_name,
    logging: false
});