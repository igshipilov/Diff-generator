import _ from 'lodash';

export default (file1, file2) => {
  const iter = (obj1, obj2) => {
    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);

    const keys = _.sortBy(_.union(keys1, keys2)); // Array of keys from both objects

    const arr = keys.map((key) => {
      const isKey1Object = _.isPlainObject(obj1[key]);
      const isKey2Object = _.isPlainObject(obj2[key]);

      if (!Object.hasOwn(obj2, key)) {
        const actualKey1 = isKey1Object ? iter(obj1[key], obj1[key]) : obj1[key];
        return { stat: 'removed', key, value: actualKey1 };
      } if (!Object.hasOwn(obj1, key)) {
        const actualKey2 = isKey2Object ? iter(obj2[key], obj2[key]) : obj2[key];
        return { stat: 'added', key, value: actualKey2 };
      } if (isKey1Object && isKey2Object) {
        return { stat: 'nested', key, value: iter(obj1[key], obj2[key]) };
      } if (obj1[key] !== obj2[key]) {
        return {
          stat: 'updated', key, valueOld: obj1[key], valueNew: obj2[key],
        };
      }
      return { stat: 'unchanged', key, value: obj2[key] };
    });

    return arr;
  };

  const resultData = iter(file1, file2);

  return resultData;
};
