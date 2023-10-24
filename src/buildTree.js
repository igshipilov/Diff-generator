import _ from 'lodash';

export const buildTree = (file1, file2) => {
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
        return { stat: 'removed', key: key, value: actualKey1 }

      } if (!Object.hasOwn(obj1, key)) {
        const actualKey2 = isKey2Object ? iter(obj2[key], obj2[key]) : obj2[key];
        return { stat: 'added', key: key, value: actualKey2 }

      } if (isKey1Object && isKey2Object) {
        return { stat: 'nested', key: key, value: iter(obj1[key], obj2[key])}

      } if (obj1[key] !== obj2[key]) {
        return { stat: 'updated', key: key, valueOld: obj1[key], valueNew: obj2[key] }

      }
      return { stat: 'unchanged', key: key, value: obj2[key] }
      });
  
    return arr;
  }

  const resultData = iter(obj1, obj2);

  return resultData;
};



// ===== TESTS ========
// import { getData } from './formatter/index.js';

// const test = buildTree(getData('__fixtures__/file1.json'), getData('__fixtures__/file2.json'));
// console.log(test[0].common[5]);
// console.log(JSON.stringify(test, null, 2));
// ====================
