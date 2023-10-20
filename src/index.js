import _ from 'lodash';
import getParsedFile from './parsers.js';

const getStylish = (data) => {
  const iter = (node, depth) => {
    // if (!Array.isArray(node)) { 

    if (!_.isPlainObject(node) && !Array.isArray(node)) {
      return node;
    }

    // if (_.isPlainObject(node)) {
    //   return iter([node], depth + 1);
    // }


    const spacer = ' ';
    const spacerCount = 4;
    const indentCount = (spacerCount * depth) - 2;
    const currentIndent = spacer.repeat(indentCount);
    const bracketIndent = spacer.repeat(indentCount - (spacerCount / 2));
    const br = '\n';

    const statSign = (stat) => {
      switch (stat) {
        case 'deleted': return '- ';
        case 'added': return '+ ';
        case 'changed': return ['- ', '+ '];
        default: return '  ';
      }
    };

      const arr = node.map((obj) => {
        const [currentStat, key] = Object.keys(obj);
        const value = obj[key];
        const stat = obj[currentStat];
        if (!_.has(obj, 'stat')) {
          return obj;
        }

        if (stat === 'added') {
          return `${currentIndent}${statSign(stat)}${key}: ${iter(value, depth + 1)}`;

        } if (stat === 'deleted') {
          return `${currentIndent}${statSign(stat)}${key}: ${iter(value, depth + 1)}`;

        } if (stat === 'changed') {
          const [value1, value2] = value;
          const [deleted, added] = statSign(stat);

          const processValue = (val) => {
            if (_.isPlainObject(val)) {
              const entries = Object.entries(val);
              const result = entries.map(([key, value]) => `${key}: ${processValue(value)}`);
              return `{\n${result.join(',\n')}\n}`;
            }
            return val;
          }
          
          // FIXME -- возвращает неправильный результат:
          // `nest: [object Object]` вместо `nest: { key: value }`

          // Гипотеза: в return нужно заменить value1 и value2 на
          // iter(value1, depth + 1) и iter(value2, depth + 1)

          // но если так сделать, то вылетает ошибка:
          // TypeError: node.map is not a function
          // потому что я пытаюсь замэпить объект `{ key: value }`,
          // когда итеративно проваливаюсь в value1 и value2

          // return `${currentIndent}${deleted}${key}: ${value1}${br}${currentIndent}${added}${key}: ${value2}`;
          return `${currentIndent}${deleted}${key}: ${processValue(value1)}${br}${currentIndent}${added}${key}: ${processValue(value2)}`;
          // return `${currentIndent}${deleted}${key}: ${iter(value1, depth + 1)}${br}${currentIndent}${added}${key}: ${iter(value2, depth + 1)}`;
          // return `${currentIndent}${deleted}${key}: ${processValue(value1)}${br}${currentIndent}${added}${key}: ${processValue(value2)}`;

        } if (stat === 'unchanged') {
          return `${currentIndent}${statSign(stat)}${key}: ${iter(value, depth + 1)}`;

        } if (stat === 'nested') {
          return `${currentIndent}${statSign(stat)}${key}: ${iter(value, depth + 1)}`
        }
      });

      return ['{', ...arr, `${bracketIndent}}`]
        .join('\n');
    };

  return iter(data, 1);
};


// genDiff v03 -- массив объектов
// const genDiff = (file1, file2, formatter = 'stylish') => {
//   const obj1 = getParsedFile(file1);
//   const obj2 = getParsedFile(file2);

//   const iter = (obj1, obj2) => {
//     const keys1 = Object.keys(obj1);
//     const keys2 = Object.keys(obj2);
  
//     const keys = _.union(keys1, keys2).sort(); // Массив со списком всех ключей из обоих объектов

//     const arr = keys.map((key) => {

//       const isKey1Object = _.isPlainObject(obj1[key]); // <== программа падает здесь
//       const isKey2Object = _.isPlainObject(obj2[key]);

//       if (!Object.hasOwn(obj2, key)) {
//         return { stat: 'deleted', [key]: obj1[key] }

//       } if (!Object.hasOwn(obj1, key)) {
//         return { stat: 'added', [key]: obj2[key] }

//       } if (isKey1Object && isKey2Object) {
//         return { stat: 'nested', [key]: iter(obj1[key], obj2[key])}

//       } if (obj1[key] !== obj2[key]) {
//         return { stat: 'changed', [key]: [obj1[key], obj2[key]] }

//       }
//       return { stat: 'unchanged', [key]: obj2[key] }
//       });
  
//     return arr;
//   }
  
//   const resultData = iter(obj1, obj2);
//   // return resultData;
//   switch (formatter) {
//     default: return getStylish(resultData);
//   }
// };




// genDiff v04 -- массив объектов, вложенность изменённых ключей
const genDiff = (file1, file2, formatter = 'stylish') => {
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

  // return resultData;
  
  switch (formatter) {
    default: return getStylish(resultData);
  }
};







console.log('>> genDiff:');
// const testResult = JSON.stringify(genDiff('__fixtures__/gdFile1.json', '__fixtures__/gdFile2.json'), null, '  ');
// const testResult = JSON.stringify(genDiff('__fixtures__/file1.json', '__fixtures__/file2.json'), null, 2);
// console.log(testResult);

// console.log(genDiff('__fixtures__/gdFile1.json', '__fixtures__/gdFile2.json'));
console.log(genDiff('__fixtures__/file1.json', '__fixtures__/file2.json'));
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











export default genDiff;

// console.log(genDiff('__fixtures__/file1.json', '__fixtures__/file2.json'));
// console.log(getStylishDiff('__fixtures__/gdFile1.json', '__fixtures__/gdFile2.json'));
// console.log(getStylishDiff('__fixtures__/file1.json', '__fixtures__/file2.json'));





// console.log('>> stringify:');
// console.log(stringify(genDiff('__fixtures__/gdFile1.json', '__fixtures__/gdFile2.json')));
// console.log(genDiff(genDiff('__fixtures__/file1.json', '__fixtures__/file2.json')));
// console.log(genDiff(
//   genDiff(
//     '/home/igshipilov/frontend-project-46/__fixtures__/file1.json',
//     '/home/igshipilov/frontend-project-46/__fixtures__/file2.json'
//   )
// ));
