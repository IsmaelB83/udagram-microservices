// Node Imports
import express from 'express';
import { sequelize } from './sequelize';
import bodyParser from 'body-parser';
// Own Imports
import { FeedRouter } from './controllers/v0/router.index';
import { FeedItem } from './controllers/v0/model.index';
import config from "./config";

// Constants
const ENV = config.ENV;

// Initialize sequelize
sequelizeConfig();

// Create express
const app = express();
const port = ENV.PORT || 8080;

// Middlewares
app.use(bodyParser.json());

// CORS Should be restricted
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", config.ENV.ORIGIN);
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    next();
});

// Routes
app.use('/api/v0/feed', FeedRouter);
app.get( "/", async (req, res) => res.send( "/api/v0/" ));

// Start the Server
app.listen( port, () => {
    console.log( `server running http://localhost:${ port }` );
    console.log( `press CTRL+C to stop server` );
} );

// Sequelize
async function sequelizeConfig (): Promise<void> {
    console.log('Starting sequelize...')
    await sequelize.authenticate();
    await sequelize.addModels([FeedItem]);
    if (ENV.ENV === 'DEV') {
        await sequelize.sync({ force: true, logging: console.log });
    }
    console.log('Sequelize configuration... OK');
}