const _ = require("lodash");
const mongoose = require("mongoose");
const { parseResolveInfo, simplifyParsedResolveInfoFragmentWithType } = require("graphql-parse-resolve-info");

const createProjection = (resolverInfo) => {
  const parsedResolveInfoFragment = parseResolveInfo(resolverInfo);
  const { fields } = simplifyParsedResolveInfoFragmentWithType(parsedResolveInfoFragment, resolverInfo.returnType);

  const getProjection = (fields) => {
    const projection = {};
    const fieldKeys = Object.keys(fields);

    fieldKeys.forEach((fieldKey) => {
      const subFields = fields?.[fieldKey]?.fieldsByTypeName;
      const hasSubFields = Object.keys(subFields).length !== 0;

      if (!hasSubFields) {
        projection[fieldKey] = 1;
        return projection;
      }

      const subFieldTypes = Object.keys(fields?.[fieldKey]?.fieldsByTypeName);
      let subFieldProjection = {};
      subFieldTypes.forEach((type) => {
        const subFields = fields?.[fieldKey]?.fieldsByTypeName?.[type];
        subFieldProjection = { ...subFieldProjection, ...getProjection(subFields) };
      });

      projection[fieldKey] = subFieldProjection;
    });

    return projection;
  };

  return getProjection(fields);
};

const generatePopulatePaths = (model, projection) => {
  const { __v, _id, createdAt, updatedAt, ...schemaPaths } = model.schema.paths;
  const schemaKeys = Object.keys(schemaPaths);
  const populatePaths = [];

  schemaKeys.forEach((key) => {
    const {
      path,
      instance,
      options,
      options: { shouldPopulate },
    } = schemaPaths[key];

    if (!shouldPopulate) return;

    const select = _.get(projection, path) || {};
    if (select) _.set(projection, path, 1);

    const selectKeys = Object.keys(select);
    const isIDOnlyRequest = selectKeys.length === 1 && selectKeys[0] === "id";

    if (isIDOnlyRequest) return;

    const isArray = instance === "Array";
    const ref = isArray ? options.type[0].ref : options.ref;

    const populate = generatePopulatePaths(mongoose.model(ref), select);
    populatePaths.push({ path, select, ...(populate.length > 0 && { populate }) });
  });

  return populatePaths;
};

module.exports = {
  createProjection,
  generatePopulatePaths,
};
