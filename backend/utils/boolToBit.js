
const to = (value) => {
  if (value === null) {
    return false;
  }
  const res = new Buffer(1);
  res[0] = value ? 1 : 0;
  return res;
}
// From db to typeorm
const from = (value) => {
  if (value === null) {
    return null;
  }
  return value[0] === 1;
}

module.export = { to, from }