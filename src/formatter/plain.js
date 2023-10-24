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












export default (data) => {
  const iter = (val, propPath) => {
    const result = val.flatMap((node) => {
      const pairs = Object.entries(node); // [['stat', 'nested'], ['common', '[Array]']]
      const [statNameVal, keyValue] = pairs;
      const [statName, stat] = statNameVal;
      const [key, value] = keyValue;

      const propertyPath = path.join(propPath, key);
      const formattedPath = propertyPath.replaceAll('/', '.')

      const isValueObject = _.isPlainObject(value);
      const curentValue = isValueObject ? '[complex value]' : value;

      switch (stat) {
        // case 'nested': return iter(value, propertyPath);
        // case 'removed': return [propertyPath, stat];
        // case 'added': return [propertyPath, stat, curentValue];
        // case 'updated': return [propertyPath, stat, curentValue];

        case 'nested': return iter(value, formattedPath);
        case 'removed': return `Property '${formattedPath}' was ${stat}`;
        case 'added': return `Property '${formattedPath}' was ${stat} with value: '${curentValue}'`;
        case 'updated': return `Property '${formattedPath}' was ${stat}. From '${curentValue[0]}' to '${curentValue[1]}'`;
        default: return '';
      }
      
      // if (stat !== 'nested') {
      //   // всегда false, потому что объекты лежат внутри массива
      //   const isValueObject = _.isPlainObject(value); 

      //   return (isValueObject ? '[complex value]' : value); // не работает, почему?
      // }
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