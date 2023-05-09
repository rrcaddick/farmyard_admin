const { MongoDataSource: MongoDataSourceOriginal } = require("apollo-datasource-mongodb");
const { createProjection, generatePopulatePaths } = require("../utils/mongo-db");
const { Mongoose } = require("mongoose");

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
}

module.exports = {
  MongoDataSource,
};
