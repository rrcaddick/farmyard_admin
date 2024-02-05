const _ = require("lodash");
const { MongoDataSource: MongoDataSourceOriginal } = require("apollo-datasource-mongodb");
const { createProjection, generatePopulatePaths } = require("../utils/mongo-db");
const { Mongoose } = require("mongoose");
const { User } = require("../../models/user");
const { UserInputError } = require("apollo-server-express");

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

    if (!isQuery && !Array.isArray(query)) {
      return await query.populate(populatePaths);
    }

    if (!isQuery && Array.isArray(query)) {
      const queryResults = [];

      for (let q of query) {
        queryResults.push(await q.populate(populatePaths));
      }

      return queryResults;
    }

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

  async createDocumentsFromArray(documentArray, arrayName, model, uniqueErrors, session) {
    const array = [];
    const errors = [];

    const tryArrayTransaction = async (session, index = 0) => {
      for (let i = index; i < documentArray.length; i++) {
        try {
          const [document] = await model.create([documentArray[i]], { session });
          array.push(document);
        } catch (error) {
          switch (error.code) {
            case 11000:
              const { keyValue } = error;
              const data = Object.fromEntries(
                Object.keys(keyValue).map((key) => [`${arrayName}[${i}].${key}`, uniqueErrors[key]])
              );
              errors.push(data);
              break;
            case 251:
              await session.abortTransaction();
              session.startTransaction();
              await tryArrayTransaction(session, i);
              break;
            default:
              break;
          }
        }
      }
    };

    await tryArrayTransaction(session);

    if (errors.length > 0) {
      throw new UserInputError("Validation Failed", { data: _.merge({}, ...errors) });
    }

    return array;
  }

  parseBulkWriteDuplicateError(error) {
    const errorString = error.split("dup key: ")[1];
    return JSON.parse(errorString.replace(/([a-zA-Z]+):/g, '"$1":'));
  }

  throwUniqueViolationGraphqlError(error, uniqueErrors) {
    const { keyValue } = error;
    const data = Object.fromEntries(Object.keys(keyValue).map((key) => [key, uniqueErrors[key]]));
    throw new UserInputError("Validation Failed", { data });
  }
}

module.exports = {
  MongoDataSource,
};
