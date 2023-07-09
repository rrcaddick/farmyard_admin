const { createApplication } = require("graphql-modules");
const { addInfoToContext } = require("./middleware/add-info-to-context");
const { authGaurd } = require("./middleware/auth-guard");
const { globalModule } = require("./modules/global/module");
const { ikhokhaSaleModule } = require("./modules/ikhokha-sale/module");
const { quicketSaleModule } = require("./modules/quicket-sale/module");
const { userModule } = require("./modules/user/module");
const { priceModule } = require("./modules/price/module");
const { groupTypeModule } = require("./modules/group-type/module");
const { contactModule } = require("./modules/contact/module");
const { groupModule } = require("./modules/group/module");
const { bookingModule } = require("./modules/booking/module");
const { IkhokhaSource } = require("./modules/ikhokha-sale/data-source");
const { QuicketSource } = require("./modules/quicket-sale/data-source");
const { UserSource } = require("./modules/user/data-source");
const { PriceSource } = require("./modules/price/data-source");
const { GroupTypeSource } = require("./modules/group-type/data-source");
const { ContactSource } = require("./modules/contact/data-source");
const { GroupSource } = require("./modules/group/data-source");
const { BookingSource } = require("./modules/booking/data-source");

const graphqlApplication = createApplication({
  modules: [
    globalModule,
    ikhokhaSaleModule,
    quicketSaleModule,
    userModule,
    priceModule,
    groupTypeModule,
    contactModule,
    groupModule,
    bookingModule,
  ],
  middlewares: {
    Query: {
      "*": [authGaurd, addInfoToContext],
    },
    Mutation: {
      "*": [authGaurd, addInfoToContext],
    },
  },
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
  priceSource: new PriceSource(),
  groupTypeSource: new GroupTypeSource(),
  contactSource: new ContactSource(),
  groupSource: new GroupSource(),
  bookingSource: new BookingSource(),
});

// TODO: Format errors for easier access
const formatError = (err) => {
  return {
    message: err.message,
    path: err?.path,
    code: err?.extensions?.code,
    data: err?.extensions?.data,
  };
};

module.exports = {
  graphqlApplication,
  executor: graphqlApplication.createApolloExecutor(),
  schema: graphqlApplication.schema,
  context,
  dataSources,
  formatError,
  injector: graphqlApplication.injector,
};
