import _ from 'lodash';

// Формат вывода:
// `Property ${propertyPath} was ${stat}`
  // -- stat: 'added' --> `...with value: ${value}`
  // -- stat: 'removed' --> (ничего больше не пишем)
  // -- stat: 'changed' --> `...updated. From ${valueOld} to ${valueNew}` 

// Он должен проваливаться до тех пор, пока `stat === 'nested'`

// TODO
// До тех пор, пока `stat === 'nested'`, строим путь:
// К названию текущего ключа приписываем

// Если stat !== 'nested && !_.isPlainObject(value)
// return propertyPath
// Иначе рекурсия: 
const getPropertyPath = (stat, key) => {
  const iter = (propertyPath) => {
    if (stat === 'nested') {
      return iter(`${propertyPath}${key}.`)
    } return `${propertyPath}${key}`
  };

  return iter('');
};


const makePlainData = (data) => {
  const [currentStat, key] = Object.keys(data);
  const stat = data[currentStat];
  const value = data[key];

  let propertyPath = '';
  if (stat !== 'nested' && !_.isPlainObject(value)) {

  }


  return { propertyPath: propertyPath, [currentStat]: stat, [key]: value }
};

const testData = { stat: 'nested', one: { stat: 'added', two: 'value2' } };
console.log(`>> makePlainData:\n`);
console.log(makePlainData(testData));
console.log(`\n\n`);


export default (data) => {
  const arr = data.map((node) => {
    const [currentStat, key] = Object.keys(node);
    const stat = node[currentStat];
    const value = _.isPlainObject(node[key]) ? '[complex value]' : node[key];
    const propertyPath = getPropertyPath(value);



    switch (stat) {
      case 'added': return `Property ${propertyPath} was ${stat} with value: ${value}`;
      case 'deleted': return `Property ${propertyPath} was removed`;
      case 'changed': {
        const [valueOld, valueNew] = value;
        return `Property ${propertyPath} was updated. From ${valueOld} to ${valueNew}`
      };
      // default: return '';
    }
  });

  const result = arr
    // .join('\n');

  return result;
};