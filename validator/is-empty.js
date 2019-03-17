//rather than using lodash and adding libs..

//validator has a is empty built in function but it only checks string

function isEmpty(value) {
  return (
    value === undefined ||
    value === null ||
    (typeof value === "object" && Object.keys(value).length === 0) ||
    (typeof value === "string" && value.trim().length === 0)
  );
}

module.exports = isEmpty;
