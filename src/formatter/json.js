export const getJSON = (data) => {
  const result = JSON.stringify(data, null, 2)
    .replaceAll('[', '{')
    .replaceAll(']', '}');

  return result;
};
