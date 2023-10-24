import _ from 'lodash';
import path from 'path';

/*

Мы должны добраться до каждого конечного изменённого ключа.


При *каком-то* условии записываем имя текущего ключа в ancestry
и передаём эту переменную в рекурсию, вида: `${ancestry}.`


ТОЧНО РАБОЧЕЕ УСЛОВИЕ:
Если stat = 'added' или 'updated', тогда в качестве значения возвращаем
либо само value, либо '[complex value]' в зависимости от типа данных. То есть решение типа:
  const result = _.isPlainObject(value) ? [complex value] : value;


*/



// Формат вывода:
// `Property ${propertyPath} was ${stat}`
  // -- stat: 'added' --> `...with value: ${value}`
  // -- stat: 'removed' --> (ничего больше не пишем)
  // -- stat: 'changed' --> `...updated. From ${valueOld} to ${valueNew}` 

// Он должен проваливаться до тех пор, пока `stat === 'nested'`




// ======= для тестов ===========
import { getData } from '../formatter/index.js';
import { buildTree } from '../buildTree.js'; 
// ==============================



// Принимает массив объектов, созданный в `buildTree.js`
  // NOTE: значения ключей могут быть массивами в таких случаях:
  // -- статус ключа 'updated' (тогда value = [valueOld, valueNew])
  // -- значение ключа – объект

// const getPlain = (data) => {
//   const iter = (arr) => {
//     const result = arr.map((node) => {
//       const entries = Object.entries(node);
      
//       return entries;

//       // для stat = 'added' результат будет такой:
//       // return `Property ${propertyPath} was ${stat} with value: ${value}`;
//     });

//     return result;
//   };

//   return iter(data)
//     // .join('\n');
// };



// const getPlain = (data) => {
//   let fullPath = [];
//   const iter = (val, myPath) => {
//     const arr = val.map((node) => {
//       const stat = node.stat;
//       const [statName, keyValue] = Object.entries(node);
//       const [key, value] = keyValue;
    
//       if (stat !== 'nested') {
//         return { propertyPath: fullPath, stat: stat, value: value }
//       } else {
//         fullPath.push(key);
//         return iter(value, fullPath)
//       }
//     });
//   };

//   const resultData = iter(data, fullPath);

//   return resultData;
// };



// Возвращает value только если stat !== 'nested'
// const getFinalValue = (data) => {
//   const propertyPath = [];

//   const iter = (val, propPath) => {
//     const result = val.map((node) => {
//       const pairs = Object.entries(node); // [['stat', 'nested'], ['common', '[Array]']]
//       const [statNameVal, keyValue] = pairs;
//       const [statName, stat] = statNameVal;
//       const [key, value] = keyValue;
//       propPath.push(key);
      

//       switch (stat) {
//         case 'nested': return iter(value, propPath);
//         case 'removed': return [propPath, stat];
//         case 'added': return [propPath, stat, value];
//         case 'updated': return value;
//       }
      
//       // if (stat !== 'nested') {
//       //   // всегда false, потому что объекты лежат внутри массива
//       //   const isValueObject = _.isPlainObject(value); 

//       //   return (isValueObject ? '[complex value]' : value); // не работает, почему?
//       // }
//     });

//     return result
//   };

//   return iter(data, propertyPath);
// };










// value должно быть:
  // -- '[complex value]' если оно объект {}
  // -- в кавычках, если оно строка
  // -- без кавычек в остальных случаях


// const correctValue = (value) => {
//   if (Array.isArray(value)) {
//     if ( _.isPlainObject(value[0])) {
//       return '[complex value]'
//     }
//     return value.map((node) => correctValue(node));
//   } 
//   return (typeof value === 'string' ? `'${value}'` : value);
//   // return value;
// };


// const correctValue = (value) => {
//   if (Array.isArray(value)) {
//     return value.map((node) => {
//       if ( _.isPlainObject(node)) {
//         return '[complex value]'
//       }
//       return value.map((node) => correctValue(node));
//       // return value;
//     })

//   } 
//   return (typeof value === 'string' ? `'${value}'` : value);
//   // return value;
// };



const correctValue = (value) => {
  if (_.isObject(value)) {
    return '[complex value]';
  }

  if (Array.isArray(value)) {
    const result = value.map((node) => _.isPlainObject(node) ? '[complex value]' :  correctValue(node));
    return result;
  } 
  const correctedValue = typeof value === 'string' ? `'${value}'` : value;
  
  return correctedValue;
};


export const getPlain = (data) => {
  const iter = (arr, propPath) => {
    const result = arr.flatMap((node) => {
      const key = node.key;
      const value = node.value;
      const stat = node.stat;

      const propertyPath = path.join(propPath, key);
      const formattedPath = propertyPath.replaceAll('/', '.')
      const curentValue = correctValue(value);

      switch (stat) {
        case 'nested': return iter(value, formattedPath);
        case 'removed': return `Property '${formattedPath}' was ${stat}`;
        case 'added': return `Property '${formattedPath}' was ${stat} with value: ${curentValue}`;
        case 'updated': {
          const valueOld = node.valueOld;
          const valueNew = node.valueNew;

          const valueOldFormatted = correctValue(valueOld);
          const valueNewFormatted = correctValue(valueNew);

          return `Property '${formattedPath}' was ${stat}. From ${valueOldFormatted} to ${valueNewFormatted}`;
        };
        default: return '';
      }
    });

    return result.filter((node) => node !== '');
  };

  return iter(data, '')
    .join('\n');
};







// ===== TESTS ========
// const tree = buildTree(getData('__fixtures__/file1.json'), getData('__fixtures__/file2.json'));
// console.log(getPlain(tree));


// console.log(JSON.stringify(tree, null, 2));
// console.log(getPlainData(tree));
// console.log(getFinalValue(tree));
// ====================




// TODO
// До тех пор, пока `stat === 'nested'`, строим путь:
// К названию текущего ключа приписываем

// Если stat !== 'nested && !_.isPlainObject(value)
// return propertyPath
// Иначе рекурсия: 
// const getPropertyPath = (stat, key) => {
//   const iter = (propertyPath) => {
//     if (stat === 'nested') {
//       return iter(`${propertyPath}${key}.`)
//     } return `${propertyPath}${key}`
//   };

//   return iter('');
// };


// const makePlainData = (data) => {
//   const [currentStat, key] = Object.keys(data);
//   const stat = data[currentStat];
//   const value = data[key];

//   let propertyPath = '';
//   if (stat !== 'nested' && !_.isPlainObject(value)) {

//   }


//   return { propertyPath: propertyPath, [currentStat]: stat, [key]: value }
// };

// const testData = { stat: 'nested', one: { stat: 'added', two: 'value2' } };
// // console.log(`>> makePlainData:\n`);
// // console.log(makePlainData(testData));
// // console.log(`\n\n`);


// export default (data) => {
//   const arr = data.map((node) => {
//     const [currentStat, key] = Object.keys(node);
//     const stat = node[currentStat];
//     const value = _.isPlainObject(node[key]) ? '[complex value]' : node[key];
//     const propertyPath = getPropertyPath(value);



//     switch (stat) {
//       case 'added': return `Property ${propertyPath} was ${stat} with value: ${value}`;
//       case 'deleted': return `Property ${propertyPath} was removed`;
//       case 'changed': {
//         const [valueOld, valueNew] = value;
//         return `Property ${propertyPath} was updated. From ${valueOld} to ${valueNew}`
//       };
//       // default: return '';
//     }
//   });

//   const result = arr
//     // .join('\n');

//   return result;
// };