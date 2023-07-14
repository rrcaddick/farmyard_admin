const { UserInputError } = require("apollo-server-express");
const _ = require("lodash");

const createDocumentArray = async (documentArray, arrayName, model, uniqueErrors, session) => {
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
};

// Parsing bulkWrite errors
const getErrorObject = (error) => {
  const errorString = error.split("dup key: ")[1];
  return JSON.parse(errorString.replace(/([a-zA-Z]+):/g, '"$1":'));
};

module.exports = { createDocumentArray };
