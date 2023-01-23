const { createApplication } = require("graphql-modules");
const { userModule } = require("./modules/user/module");

const graphqlApplication = createApplication({
  modules: [userModule],
  middlewares: [],
  providers: [],
});

const context = () => {
  const context = {};
  return context;
};

const dataSources = () => ({});

const formatError = (err) => ({});

const executor = graphqlApplication.createApolloExecutor();

module.exports = {
  graphqlApplication,
  executor,
  schema: graphqlApplication.schema,
  context,
  dataSources,
  formatError,
  injector: graphqlApplication.injector,
};
