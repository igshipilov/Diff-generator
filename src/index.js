import _ from 'lodash';
import getParsedFile from './parsers.js';

// --------- длинный долгий Switch -----------------
// const getStylish = (data) => {
//   const iter = (node, depth) => {

//     if (!_.isPlainObject(node) && !Array.isArray(node)) {
//       return node;
//     }

//     const spacer = ' ';
//     const spacerCount = 4;
//     const indentCount = (spacerCount * depth) - 2;
//     const currentIndent = spacer.repeat(indentCount);
//     const bracketIndent = spacer.repeat(indentCount - (spacerCount / 2));
//     const br = '\n';

//     const statSign = (stat) => {
//       switch (stat) {
//         case 'deleted': return '- ';
//         case 'added': return '+ ';
//         case 'changed': return ['- ', '+ '];
//         default: return '  ';
//       }
//     };

//       const arr = node.map((obj) => {
//         const [currentStat, key] = Object.keys(obj);
//         const value = obj[key];
//         const stat = obj[currentStat];

//         switch (stat) {
//           case 'added':
//             return `${currentIndent}${statSign(stat)}${key}: ${iter(value, depth + 1)}`;

//           case 'deleted':
//             return `${currentIndent}${statSign(stat)}${key}: ${iter(value, depth + 1)}`;

//           case 'changed':
//           const [value1, value2] = value;
//           const [deleted, added] = statSign(stat);

//           const processValue = (val) => {
//             if (_.isPlainObject(val)) {
//               const entries = Object.entries(val);
//               const result = entries.map(([key, value]) => `${currentIndent}${currentIndent}${key}: ${iter(processValue(value), depth + 1)}`);
             
//               return ['{', ...result, `${bracketIndent}${bracketIndent}}`].join('\n');
//             }

//             return val;
//           };
          
//           // return `${currentIndent}${deleted}${key}: ${value1}${br}${currentIndent}${added}${key}: ${value2}`;
//           return `${currentIndent}${deleted}${key}: ${processValue(value1)}${br}${currentIndent}${added}${key}: ${processValue(value2)}`;
          
//           case 'unchanged':
//             return `${currentIndent}${statSign(stat)}${key}: ${iter(value, depth + 1)}`;

//           case 'nested':
//             return `${currentIndent}${statSign(stat)}${key}: ${iter(value, depth + 1)}`;

//           default: return;
//         }
//       });

//       return ['{', ...arr, `${bracketIndent}}`]
//         .join('\n');
//     };

//   return iter(data, 1);
// };




// --------- короткий Switch -----------------

const getStylish = (data) => {
  const iter = (node, depth) => {

    if (!_.isPlainObject(node) && !Array.isArray(node)) {
      return node;
    }

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

        switch (stat) {
          case 'changed':
          const [value1, value2] = value;
          const [deleted, added] = statSign(stat);

          const processValue = (val) => {
            if (_.isPlainObject(val)) {
              const entries = Object.entries(val);
              const result = entries.map(([key, value]) => `${currentIndent}${currentIndent}${key}: ${iter(processValue(value), depth + 1)}`);
             
              return ['{', ...result, `${bracketIndent}${bracketIndent}}`].join('\n');
            }

            return val;
          };
          
            return `${currentIndent}${deleted}${key}: ${processValue(value1)}${br}${currentIndent}${added}${key}: ${processValue(value2)}`;

          default: return `${currentIndent}${statSign(stat)}${key}: ${iter(value, depth + 1)}`;
        }
      });

      return ['{', ...arr, `${bracketIndent}}`]
        .join('\n');
    };

  return iter(data, 1);
};


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







// console.log('>> genDiff:');
// const testResult = JSON.stringify(genDiff('__fixtures__/gdFile1.json', '__fixtures__/gdFile2.json'), null, '  ');
// const testResult = JSON.stringify(genDiff('__fixtures__/file1.json', '__fixtures__/file2.json'), null, 2);
// console.log(testResult);

// console.log(genDiff('__fixtures__/gdFile1.json', '__fixtures__/gdFile2.json'));
// console.log(genDiff('__fixtures__/file1.json', '__fixtures__/file2.json'));
// console.log(genDiff('__fixtures__/file1.yaml', '__fixtures__/file2.yml'));
// console.log(`\n\n`);










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














// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
// >> processValue
// const arr = node.map((obj) => {
//   const [currentStat, key] = Object.keys(obj);
//   const value = obj[key];
//   const stat = statSign(obj[currentStat]);

//   if (stat === 'changed') {
//     const [value1, value2] = value;
//     const [deleted, added] = statSign(stat);

//    return `${deleted}${iter(processValue(value1, currentIndent, bracketIndent, stat), depth + 1)}${br}${added}${iter(processValue(value2, currentIndent, bracketIndent, stat), depth + 1)}`
//   } else {
//     return `${iter(processValue(value, currentIndent, bracketIndent, stat), depth + 1)}`
//   }