import { Box } from "@mui/material";
import Header from "@components/display/header";
import { generateTempId } from "@graphql/utils/generate-temp-id";

const isFunction = (FnTest) => {
  return Object.prototype.toString.call(FnTest) === "[object Function]";
};

const isObject = (objectTest) => {
  return Object.prototype.toString.call(objectTest) === "[object Object]";
};

const isString = (stringTest) => {
  return Object.prototype.toString.call(stringTest) === "[object String]";
};

const groupResponseSchema = {
  __typename: "Group",
  id: () => generateTempId("Group"),
  name: 1,
  groupType: 1,
  address: {
    __typename: "Address",
    street: 1,
    suburb: 1,
    postCode: 1,
  },
  contacts: [
    {
      __typename: "Contact",
      id: () => generateTempId("Contact"),
      type: "Group",
      name: 1,
      email: 1,
      tel: 1,
    },
  ],
};

const data = {
  contacts: [
    {
      id: "Temp-Contact-95663",
      name: "Ray Caddick",
      email: "rrcaddick@gmail.com",
      tel: "",
    },
    {
      id: "Temp-Contact-06405",
      name: "Ash Caddick",
      email: "",
      tel: "123456",
    },
  ],
  address: {
    postCode: 7356,
    suburb: "Paarl",
    street: "123 Main Road",
  },
  groupType: {
    __typename: "GroupType",
    id: "6453c4a32e58388734c896e9",
    type: "School",
    price: {
      __typename: "Price",
      id: "6453bed52e58388734c896e4",
    },
  },
  name: "Paarl Gym",
};

const createOptimisticResponse = (schema, data) => {
  // Get required data
  if (schema === 1) return data;

  // Runs custom data function
  if (isFunction(schema)) return schema();

  // Returns static data like __typename
  if (isString(schema)) return schema;

  // Recursively loop array
  if (Array.isArray(schema)) {
    const arrayItems = [];
    for (let item of data) {
      arrayItems.push(createOptimisticResponse(schema[0], item));
    }
    return arrayItems;
  }

  return Object.fromEntries(
    Object.keys(schema).map((key) => {
      const value = createOptimisticResponse(schema[key], data[key]);
      return [key, value];
    })
  );
};

const Projects = () => {
  const clickHandler = () => {
    const optimisticResponse = createOptimisticResponse(groupResponseSchema, data);
    console.log(optimisticResponse);
  };

  return (
    <Box flexGrow={1} display="flex" flexDirection="column" gap="1rem" overflow="hidden">
      <Header title="Projects" subtitle="Never let a project fail again" />
      <button onClick={clickHandler}>Parse Form Data</button>
    </Box>
  );
};

export default Projects;
