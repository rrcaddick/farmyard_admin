const { createApplication } = require("graphql-modules");
const { addInfoToContext } = require("./middleware/add-info-to-context");
const { ikhokhaSaleModule } = require("./modules/ikhokha-sale/module");
const { quicketSaleModule } = require("./modules/quicket-sale/module");
const { userModule } = require("./modules/user/module");
const { priceModule } = require("./modules/price/module");
const { groupTypeModule } = require("./modules/group-type/module");
const { contactModule } = require("./modules/contact/module");
const { groupModule } = require("./modules/group/module");
const { IkhokhaSource } = require("./modules/ikhokha-sale/data-source");
const { QuicketSource } = require("./modules/quicket-sale/data-source");
const { UserSource } = require("./modules/user/data-source");
const { PriceSource } = require("./modules/price/data-source");
const { GroupTypeSource } = require("./modules/group-type/data-source");
const { ContactSource } = require("./modules/contact/data-source");
const { GroupSource } = require("./modules/group/data-source");

const graphqlApplication = createApplication({
  modules: [ikhokhaSaleModule, quicketSaleModule, userModule, priceModule, groupTypeModule, contactModule, groupModule],
  middlewares: {
    Query: {
      "*": [addInfoToContext],
    },
    Mutation: {
      "*": [addInfoToContext],
    },
  },
  providers: [],
});

const context = (test, test1, test2, test3) => {
  const { userId } = test.req;

  const context = {
    ...(userId && { userId }),
  };
  return context;
};

const dataSources = () => ({
  ikhokhaSource: new IkhokhaSource(),
  quicketSource: new QuicketSource(),
  userSource: new UserSource(),
  priceSource: new PriceSource(),
  groupTypeSource: new GroupTypeSource(),
  contactSource: new ContactSource(),
  groupSource: new GroupSource(),
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
