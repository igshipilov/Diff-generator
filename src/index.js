import _ from 'lodash';
import getParsedFile from './parsers.js';

// genDiff v01 -- массив массивов
// const genDiff = (file1, file2) => {
//   const obj1 = getParsedFile(file1);
//   const obj2 = getParsedFile(file2);

//   const iter = (obj1, obj2) => {
//     const keys1 = obj1 ? Object.keys(obj1) : '';
//     const keys2 = obj2 ? Object.keys(obj2) : '';
  
//     const keys = _.union(keys1, keys2).sort(); // Массив со списком всех ключей из обоих объектов

//     const arr = keys.map((key) => {


//       if (!Object.hasOwn(obj2, key)) {
//         return ['deleted', [key, obj1[key]]];
//       } if (_.isPlainObject(obj1[key]) && _.isPlainObject(obj2[key])) {
//         return [key, iter(obj1[key], obj2[key])];
//       } if (!Object.hasOwn(obj1, key)) {
//         return ['added', [key, obj2[key]]];
//       } if (obj1[key] !== obj2[key]) {
//         return ['changed', [key, obj1[key]], [key, obj2[key]]];
//       }
//       return ['unchanged', [key, obj2[key]]];
//       });
  
//     return arr;
//   }

//   return iter(obj1, obj2)
// };



// genDiff v03 -- массив объектов
const genDiff = (file1, file2) => {
  const obj1 = getParsedFile(file1);
  const obj2 = getParsedFile(file2);

  const iter = (obj1, obj2) => {
    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);
  
    const keys = _.union(keys1, keys2).sort(); // Массив со списком всех ключей из обоих объектов

    const arr = keys.map((key) => {

      const isKey1Object = _.isPlainObject(obj1[key]); // <== программа падает здесь
      const isKey2Object = _.isPlainObject(obj2[key]);

      if (!Object.hasOwn(obj2, key)) {
        return { stat: 'deleted', [key]: obj1[key] }

      } if (!Object.hasOwn(obj1, key)) {
        return { stat: 'added', [key]: obj2[key] }

      } if (isKey1Object && isKey2Object) {
        return { stat: 'nested', [key]: iter(obj1[key], obj2[key])}

      } if (obj1[key] !== obj2[key]) {
        return { stat: 'changed', [key]: [obj1[key], obj2[key]] }

      }
      return { stat: 'unchanged', [key]: obj2[key] }
      });
  
    return arr;
  }

  return iter(obj1, obj2)
};



// const testResult = JSON.stringify(genDiff('__fixtures__/gdFile1.json', '__fixtures__/gdFile2.json'), null, '  ');
// console.log(testResult);

// console.log('>> genDiff:');
// console.log(genDiff('__fixtures__/gdFile1.json', '__fixtures__/gdFile2.json'));
// console.log(genDiff('__fixtures__/file1.json', '__fixtures__/file2.json'));
// console.log(`\n\n`);












// const getStylishDiff = (file1, file2) => {
//   const obj1 = _.cloneDeep(getParsedFile(file1));
//   const obj2 = _.cloneDeep(getParsedFile(file2));

//   const keys1 = Object.keys(obj1);
//   const keys2 = Object.keys(obj2);

//   const arr = genDiff(file1, file2);

//   const iter = (data, depth) => {

//     const indent = ' ';
//     const indentCount = 2;
//     const currentIndent = indent.repeat(indentCount);
//     const innerIndent = depth > 1 ? indent.repeat(indentCount * 2) : '';
//     const br = '\n';
  
  
//     const lines = data.map(([stat, pair1, pair2]) => {
//       const [key1, value1] = pair1;
//       const [key2, value2] = pair2;
      
//       if (stat === 'added') {
//         return `${currentIndent}${innerIndent}+ ${key1}: ${obj2[key1]}`;
//       } 
//       if (stat = 'deleted') {
//         return `${currentIndent}${innerIndent}- ${key1}: ${obj1[key1]}`;
//       }
//       if (stat = 'changed') {
//         return `${currentIndent}${innerIndent}- ${key1}: ${obj1[key1]}`;
//       }
//       if (stat = 'unchanged') {
//         return `${currentIndent}${innerIndent}${key1}: ${obj1[key1]}`;
//       }
//     })
  
  
//     return ['{',
//       ...lines,
//       '}',
//     ].join(`${br}`);
//   }

//   return iter(arr, 1)
// };






// FIXME
// 1
// РАБОТАЕТ для myExpectedFinal.txt
// НЕ РАБОТАЕТ для expected.txt

// 2
// Не работают отступы
//    -- для 'unchanged' (setting1)
//    -- для значений-объектов (setting5)


const stringify = (data) => {
  const iter = (node, depth) => {
    // if (!_.isPlainObject(node)) {
    //   return `${node}`;
    // }

    if (_.isPlainObject(node)) {
      return [node];
    }

  const spacer = ' ';
  const spacerCount = 2;
  const indentCount = spacerCount * depth;
  const currentIndent = spacer.repeat(indentCount);
  const bracketIndent = spacer.repeat(indentCount - spacerCount);
  const br = '\n';

  const statSign = (stat) => {
    switch (stat) {
      case 'deleted': return '- ';
      case 'added': return '+ ';
      case 'changed': return ['- ', '+ '];
      case 'unchanged': return '  ';
    }
  };

    const arr = node.map((obj) => {
      const [currentStat, key] = Object.keys(obj);
      const value = obj[key];
      const stat = obj[currentStat];
      
      if (_.isPlainObject(value)) {
        const result = `${currentIndent}${key}: ${iter(value, depth + 1)}`;

        return result;
      }
      if (stat === 'added') {
        return `${currentIndent}+ ${key}: ${value}`;
      } if (stat === 'deleted') {
        return `${currentIndent}- ${key}: ${value}`;
      } if (stat === 'changed') {
        return `${currentIndent}- ${key}: ${value}${br}${currentIndent}+ ${key}: ${value}`;
      } if (stat === 'unchanged') {
        return `${currentIndent} ${key}: ${value}`;
      }
    });

    return ['{', ...arr, `${bracketIndent}}`].join('\n');
  };

  return iter(data, 1);
};


export default genDiff;

// console.log(genDiff('__fixtures__/file1.json', '__fixtures__/file2.json'));
// console.log(getStylishDiff('__fixtures__/gdFile1.json', '__fixtures__/gdFile2.json'));
// console.log(getStylishDiff('__fixtures__/file1.json', '__fixtures__/file2.json'));





console.log('>> stringify:');
console.log(stringify(genDiff('__fixtures__/gdFile1.json', '__fixtures__/gdFile2.json')));
// console.log(stringify(genDiff('__fixtures__/file1.json', '__fixtures__/file2.json')));
