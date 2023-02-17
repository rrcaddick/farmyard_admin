const { createApplication } = require("graphql-modules");
const { userModule } = require("./modules/user/module");
const { ikhokhaSaleModule } = require("./modules/ikhokha-sale/module");
const { quicketSaleModule } = require("./modules/quicket-sale/module");
const { IkhokhaSource } = require("./modules/ikhokha-sale/data-source");
const { QuicketSource } = require("./modules/quicket-sale/data-source");
const { UserSource } = require("./modules/user/data-source");

const graphqlApplication = createApplication({
  modules: [userModule, ikhokhaSaleModule, quicketSaleModule],
  middlewares: [],
  providers: [],
});

const context = ({ req }) => {
  const { userId } = req;

  const context = {
    ...(userId && { userId }),
  };
  return context;
};

const dataSources = () => ({
  ikhokhaSource: new IkhokhaSource(),
  quicketSource: new QuicketSource(),
  userSource: new UserSource(),
});

const formatError = (err) => ({});

// const executor = ;

module.exports = {
  graphqlApplication,
  executor: graphqlApplication.createApolloExecutor(),
  schema: graphqlApplication.schema,
  context,
  dataSources,
  formatError,
  injector: graphqlApplication.injector,
};
