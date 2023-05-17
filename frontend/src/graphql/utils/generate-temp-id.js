const generateTempId = (modelName) => {
  return `Temp-${modelName}-${Date.now().toString().slice(-5)}`;
};

export { generateTempId };
