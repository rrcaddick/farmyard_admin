import { v4 as uuid } from "uuid";

const generateTempId = (modelName) => {
  return `Temp-${modelName}-${uuid()}`;
};

export { generateTempId };
