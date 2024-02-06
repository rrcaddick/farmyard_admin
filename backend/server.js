const dotenv = require("dotenv").config();
const colors = require("colors");
const { json } = require("express");
const express = require("express");
const cookieParser = require("cookie-parser");
const { authenticate } = require("./middleware/authenticate");
const { redisClient } = require("./middleware/redis");
const { connectMongoDb } = require("./config/mongo-db");
const { ApolloServer } = require("apollo-server-express");
const { graphqlApplication, executor, schema, context, dataSources, formatError, injector } = require("./graphql");
const { ikhokhaService } = require("./services/ikhokha");
const { quicketService } = require("./services/quicket");
const { createCronSchedules } = require("./schedule");
const PORT = process.env.port || 5000;
const { User } = require("./models/user");

// Express app and middleware
const app = express();

app.use(express.urlencoded({ extended: false }), express.json(), cookieParser(), redisClient, authenticate);

// Auth Routes
app.use(require("./routes/auth.routes"));

// REST Error Handler
app.use(require("./controllers/error.controller"));

// Create Apollo server
const apolloServer = new ApolloServer({
  schema,
  context,
  dataSources,
  formatError,
  executor,
});

(async () => {
  // Connect to data base
  await connectMongoDb();

  // Start Ikhokha service
  // await ikhokhaService.start();
  // await ikhokhaService.recreateData(new Date("2021-01-01"));

  // Start Quicket Service
  // await quicketService.start();

  // Update the tickets
  // await quicketService.updateData();

  // Create cron schedules
  // createCronSchedules();

  // Start graphql server
  await apolloServer.start();
  apolloServer.applyMiddleware({ app, path: "/graphql" });

  // // Start express server
  app.listen(PORT, () => {
    console.log(`HTTP Server started on port ${PORT}`.bgYellow.black);
  });
})();
