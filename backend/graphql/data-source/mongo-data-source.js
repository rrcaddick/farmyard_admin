const { MongoDataSource: MongoDataSourceOriginal } = require("apollo-datasource-mongodb");
const { createProjection, generatePopulatePaths } = require("../utils/mongo-db");

class MongoDataSource extends MongoDataSourceOriginal {
  constructor(model) {
    super(model);
  }

  async executeWithGraphqlProjection(query) {
    const {
      dataSources: { resolverInfo },
    } = this.context;
    
    const projection = createProjection(resolverInfo);
    const populatePaths = generatePopulatePaths(this.model, projection);
    return query.populate(populatePaths).select(projection);
  }
}

module.exports = {
  MongoDataSource,
};
