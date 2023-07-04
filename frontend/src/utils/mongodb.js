const checkForHexRegExp = new RegExp("^[0-9a-fA-F]{24}$");

const isValidObjectId = (id) => {
  if (id == null) return false;

  if (typeof id == "number") return true;
  if (typeof id == "string") {
    return id.length === 12 || (id.length === 24 && checkForHexRegExp.test(id));
  }
  return false;
};

export { isValidObjectId };
