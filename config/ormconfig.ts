import { DataSource } from "typeorm";
import log4js from '../helpers/logger';
// Using environment variables
import dotenv from "dotenv";
dotenv.config();
var logger = log4js.getLogger();
const connectDB =  new DataSource({
    type: "postgres",
    host: process.env.POSTGRES_HOST,
    port: parseInt(process.env.POSTGRES_PORT),
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
    logging: false,
    synchronize: true,
    entities: ["./graphql/**/types/*.ts"]
    
})

connectDB
    .initialize()
    .then(() => {
        logger.log(`Data Source has been initialized`);
    })
    .catch((err) => {
        logger.error(`Data Source initialization error`, err);
    })

export default connectDB;