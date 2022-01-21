// Node imports
import { Sequelize } from 'sequelize-typescript';
// Own imports
import config from "./config";

// Constants
const POSTGRES_CONFIG = config.POSTGRES;

// Instantiate new Sequelize instance
export const sequelize = new Sequelize({
    "username": POSTGRES_CONFIG.USERNAME,
    "password": POSTGRES_CONFIG.PASSWORD,
    "database": POSTGRES_CONFIG.DATABASE,
    "host":     POSTGRES_CONFIG.HOST,   
    dialect: POSTGRES_CONFIG.DIALECT,
    storage: ':memory:',
});