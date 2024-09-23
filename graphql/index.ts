import "reflect-metadata";
import { buildSchema   } from "type-graphql";
import log4js from '../helpers/logger';

import { environment, serverConf } from '../config';

import connectDB from "../config/ormconfig"; //  Import DB config and create connection with DB

import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';

const path = require('path')

var { graphqlHTTP } = require('express-graphql');

var logger = log4js.getLogger();

async function main() {
  connectDB
  
  const schema = await buildSchema({
    resolvers: [path.join(__dirname,'./**/resolvers/*')],

    validate: false
  })

  // Create an express server and a GraphQL endpoint
  var app = express();
  app.use(express.json()) // for parsing application/json
  app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded
  app.use(cookieParser());
  app.use(cors());

  const loggingMiddleware = (req, res, next) => {
    
    logger.info("Request:", JSON.stringify(req.body))
    res.on('finish', () => {
      
      logger.info("Response:", {
        statusCode: res.statusCode
      });
    });
    next()
  }
  app.use(loggingMiddleware)
  app.use('/graphql', (req, res) => graphqlHTTP({
      schema,
      graphiql: ((environment.match('development')) ? true : false),
      debug: false,
      context: { req,res }
  })(req,res)
  );

  //const server = new ApolloServer({ schema })
  await app.listen(
    serverConf.SERVER_PORT,
    () => {
        logger.info('##########################################################');
        logger.info('#####               STARTING SERVER                  #####');
        logger.info('##########################################################\n');
        logger.info(`App running on ${environment.toUpperCase()} mode and listening on port ${serverConf.SERVER_PORT} ...`);
    }
);
}
main()