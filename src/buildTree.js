import _ from 'lodash';

export default (file1, file2) => {
  const obj1 = file1;
  const obj2 = file2;

  const iter = (obj1, obj2) => {
    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);
  
    const keys = _.union(keys1, keys2).sort(); // Массив со списком всех ключей из обоих объектов

    const arr = keys.map((key) => {

      const isKey1Object = _.isPlainObject(obj1[key]);
      const isKey2Object = _.isPlainObject(obj2[key]);


      if (!Object.hasOwn(obj2, key)) {
        const actualKey1 = isKey1Object ? iter(obj1[key], obj1[key]) : obj1[key];
        return { stat: 'deleted', [key]: actualKey1 }

      } if (!Object.hasOwn(obj1, key)) {
        const actualKey2 = isKey2Object ? iter(obj2[key], obj2[key]) : obj2[key];
        return { stat: 'added', [key]: actualKey2  }

      } if (isKey1Object && isKey2Object) {
        return { stat: 'nested', [key]: iter(obj1[key], obj2[key])}

      } if (obj1[key] !== obj2[key]) {
        return { stat: 'changed', [key]: [obj1[key], obj2[key]] }

      }
      return { stat: 'unchanged', [key]: obj2[key] }
      });
  
    return arr;
  }

  const resultData = iter(obj1, obj2);

  return resultData;
};