const isPrimitive = (value) => {
  const type = Object.prototype.toString.call(value);
  return (
    type === "[object String]" ||
    type === "[object Number]" ||
    type === "[object BigInt]" ||
    type === "[object Boolean]" ||
    type === "[object Undefined]" ||
    type === "[object Symbol]" ||
    value === null
  );
};

const isFunction = (value) => {
  return Object.prototype.toString.call(value) === "[object Function]";
};

const isObject = (value) => {
  return !Array.isArray(value) && Object.prototype.toString.call(value) === "[object Object]";
};

const stringifyPath = (path, data) => {
  const keys = path.split(".");
  let current = data;
  keys.forEach((key) => {
    if (Array.isArray(current[key])) {
      current[key].forEach((item, index) => {
        current[key][index] = JSON.stringify(item);
      });
    } else {
      current[key] = JSON.stringify(current[key]);
    }
    current = current[key];
  });
};

const removeProperty = (data, propertyName) => {
  if (Array.isArray(data)) {
    const arrayObjects = [];
    for (let item of data) {
      arrayObjects.push(removeProperty(item, propertyName));
    }
    return arrayObjects;
  }

  if (!isObject(data)) {
    return data ?? "";
  }

  return Object.fromEntries(
    Object.keys(data).reduce((entries, key) => {
      return key === propertyName ? entries : [...entries, [key, removeProperty(data[key], propertyName)]];
    }, [])
  );
};

export { isPrimitive, isFunction, isObject, stringifyPath, removeProperty };
