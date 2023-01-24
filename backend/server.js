const dotenv = require("dotenv").config();
const colors = require("colors");
const { json } = require("express");
const express = require("express");
const cookieParser = require("cookie-parser");
const { connectMongoDb } = require("./config/mongo-db");
const { ApolloServer } = require("apollo-server-express");
const { graphqlApplication, executor, schema, context, dataSources, formatError, injector } = require("./graphql");
const { ikhokhaService } = require("./services/ikhokha");
const PORT = process.env.port || 5000;

// Express app and middleware
const app = express();
app.use(express.urlencoded({ extended: false }), express.json(), cookieParser());

// Create Apollo server
const apolloServer = new ApolloServer({
  schema,
  context,
  dataSources,
  // formatError,
  executor,
});

(async () => {
  // Start Ikhokha service
  await ikhokhaService.start();

  // Connect to data base
  await connectMongoDb();

  // Start graphql server
  await apolloServer.start();
  apolloServer.applyMiddleware({ app, path: "/test" });

  // Start express server
  app.listen(PORT, () => {
    console.log(`HTTP Server started on port ${PORT}`.bgYellow.black);
  });
})();
