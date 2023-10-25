export default (data) => {
  const result = JSON.stringify(data, null, 2);

  return result;
};
