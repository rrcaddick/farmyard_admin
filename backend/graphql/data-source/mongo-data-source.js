const { MongoDataSource: MongoDataSourceOriginal } = require("apollo-datasource-mongodb");
const { createProjection, generatePopulatePaths } = require("../utils/mongo-db");
const { Mongoose } = require("mongoose");
const { User } = require("../../models/user");

class MongoDataSource extends MongoDataSourceOriginal {
  constructor(model) {
    super(model);
  }

  async executeWithGraphqlProjection(query) {
    const {
      dataSources: { resolverInfo },
    } = this.context;

    const isQuery = query instanceof Mongoose.prototype.Query;

    const projection = createProjection(resolverInfo);
    const populatePaths = generatePopulatePaths(this.model, projection);

    if (!isQuery) return await query.populate(populatePaths);

    return query.populate(populatePaths).select(projection);
  }

  async addCreatedBy(input, userId, createdBy = null) {
    const { name } = createdBy || (await User.findById(userId).select({ name: 1 }));
    input.createdBy = { user: userId, name };
    return input;
  }

  createSubDocumentUpdateQuery(subDocumentName, subDocument) {
    return Object.fromEntries(Object.entries(subDocument).map(([key, value]) => [`${subDocumentName}.${key}`, value]));
  }
}

module.exports = {
  MongoDataSource,
};
