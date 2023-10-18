import _ from 'lodash';
import getParsedFile from './parsers.js';

// genDiff v01
const genDiff = (file1, file2) => {
  const obj1 = getParsedFile(file1);
  const obj2 = getParsedFile(file2);

  const iter = (obj1, obj2) => {
    const keys1 = obj1 ? Object.keys(obj1) : '';
    const keys2 = obj2 ? Object.keys(obj2) : '';
  
    const keys = _.union(keys1, keys2).sort(); // Массив со списком всех ключей из обоих объектов

    const arr = keys.map((key) => {
      const obj1Key = obj1[key] || ''; // <== FIXME программа падает здесь
      const obj2Key = obj2[key];

      if (!Object.hasOwn(obj2, key)) {
        return ['deleted', [key, obj1[key]]];
      } if (_.isPlainObject(obj1[key]) || _.isPlainObject(obj2[key])) { // <== FIXME точнее, здесь
        return [key, iter(obj1[key], obj2[key])];
      } if (!Object.hasOwn(obj1, key)) {
        return ['added', [key, obj2[key]]];
      } if (obj1[key] !== obj2[key]) {
        return ['changed', [key, obj1[key]], [key, obj2[key]]];
      }
      return ['unchanged', [key, obj2[key]]];
      });
  
    return arr;
  }

  return iter(obj1, obj2)
};





// genDiff v02
// const genDiff = (file1, file2) => {
//   const obj1 = getParsedFile(file1);
//   const obj2 = getParsedFile(file2);

//   const iter = (obj1, obj2) => {
//     const keys1 = obj1 ? Object.keys(obj1) : '';
//     const keys2 = obj2 ? Object.keys(obj2) : '';
  
//     const keys = _.union(keys1, keys2).sort(); // Массив со списком всех ключей из обоих объектов

//     const arr = keys.map((key) => {
//       const obj1Key = obj1[key] || '';
//       const obj2Key = obj2[key];

//       if (!Object.hasOwn(obj2, key)) {
//         return ['deleted', [key, obj1[key]]];
//       } if (!Object.hasOwn(obj1, key)) {
//         return ['added', [key, obj2[key]]];
//       } if (obj1[key] !== obj2[key]) {
//         return ['changed', [key, obj1[key]], [key, obj2[key]]];
//       } if (obj1[key] === obj2[key]) {
//         return ['unchanged', [key, obj2[key]]];
//       } else {
//         return [key, iter(obj1[key], obj2[key])]; // не сработало – до сюда не доходит
//       }
      
//       });
  
//     return arr;
//   }

//   return iter(obj1, obj2)
// };

const testResult = JSON.stringify(genDiff('__fixtures__/gdFile1.json', '__fixtures__/gdFile2.json'), null, '  ');
console.log(testResult);
// console.log('>> genDiff:');
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










const stringify = (data, replacer = ' ', spaceCount = 2) => {
  const iter = (node, depth) => {
    // if (!_.isPlainObject(node)) {
    //   return `${node}`;
    // }

    const indentSize = spaceCount * depth;
    const currentIndent = replacer.repeat(indentSize);
    const bracketIndent = replacer.repeat(indentSize - spaceCount);
    const br = '\n';

    const arr = node.map(([stat, pair1, pair2]) => {
      const [key1, value1] = pair1;
      const [key2, value2] = pair2;

      if (_.isPlainObject(value)) {
        const result = `${currentIndent}${key1}: ${iter(value1, depth + 1)}`;

        return result;
      }
      if (stat === 'added') {
        return `${currentIndent}+ ${key1}: ${value1}`;
      } if (stat = 'deleted') {
        return `${currentIndent}- ${key1}: ${value1}`;
      } if (stat = 'changed') {
        return `${currentIndent}- ${key1}: ${value1}${br}${currentIndent}+ ${key2}: ${value2}`;
      } if (stat = 'unchanged') {
        return `${currentIndent} ${key1}: ${value1}`;
      }
    });

    return ['{', ...arr, `${bracketIndent}}`].join('\n');
  };

  return iter(data, 1);
};


export default genDiff;

// console.log(genDiff('__fixtures__/file1.json', '__fixtures__/file2.json'));
// console.log(getStylishDiff('__fixtures__/file1.json', '__fixtures__/file2.json'));





// console.log('>> stringify:');
// console.log(stringify(genDiff('__fixtures__/file1.json', '__fixtures__/file2.json')));
