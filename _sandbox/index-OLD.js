import _ from 'lodash';
import getParsedFile from '../src/parsers.js';

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

const getPropertyPath = (stat, key) => {
  const iter = (propertyPath) => {
    if (stat === 'nested') {
      return iter(`${propertyPath}${key}.`);
    } return `${propertyPath}${key}`;
  };

  return iter('');
};

const makePlainData = (data) => {
  const [currentStat, key] = Object.keys(data);
  const stat = data[currentStat];
  const value = data[key];

  const propertyPath = '';
  if (stat !== 'nested' && !_.isPlainObject(value)) {

  }

  return { propertyPath, [currentStat]: stat, [key]: value };
};

const testData = { stat: 'nested', one: { stat: 'added', two: 'value2' } };
console.log('>> makePlainData:\n');
console.log(makePlainData(testData));
console.log('\n\n');

const getPlain = (data) => {
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
        return `Property ${propertyPath} was updated. From ${valueOld} to ${valueNew}`;
      }
    }
  });

  const result = arr;

  return result;
};

const genDiff = (file1, file2, formatter = 'stylish') => {
  const obj1 = getParsedFile(file1);
  const obj2 = getParsedFile(file2);

  const iter = (obj1, obj2) => {
    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);

    const keys = _.union(keys1, keys2).sort(); // Массив со списком всех ключей из обоих объектов

    const arr = keys.map((key) => {
      const isKey1Object = _.isPlainObject(obj1[key]);
      const isKey2Object = _.isPlainObject(obj2[key]);

      if (!Object.hasOwn(obj2, key)) {
        const actualKey1 = isKey1Object ? iter(obj1[key], obj1[key]) : obj1[key];
        return { stat: 'deleted', [key]: actualKey1 };
      } if (!Object.hasOwn(obj1, key)) {
        const actualKey2 = isKey2Object ? iter(obj2[key], obj2[key]) : obj2[key];
        return { stat: 'added', [key]: actualKey2 };
      } if (isKey1Object && isKey2Object) {
        return { stat: 'nested', [key]: iter(obj1[key], obj2[key]) };
      } if (obj1[key] !== obj2[key]) {
        return { stat: 'changed', [key]: [obj1[key], obj2[key]] };
      }
      return { stat: 'unchanged', [key]: obj2[key] };
    });

    return arr;
  };

  const resultData = iter(obj1, obj2);

  return resultData;

  switch (formatter) {
    case 'plain': return getPlain(resultData);
    default: return getStylish(resultData);
  }
};

export default genDiff;

// ======= TESTS ==========
// console.log('>> genDiff:');
// const testResult = JSON.stringify(genDiff('__fixtures__/gdFile1.json', '__fixtures__/gdFile2.json'), null, '  ');
// const testResult = JSON.stringify(genDiff('__fixtures__/file1.json', '__fixtures__/file2.json', 'plain'), null, 2);
// console.log(testResult);

// console.log(genDiff('__fixtures__/gdFile1.json', '__fixtures__/gdFile2.json'));
// console.log(genDiff('__fixtures__/file1.json', '__fixtures__/file2.json', 'plain'));
// console.log(genDiff('__fixtures__/file1.yaml', '__fixtures__/file2.yml'));
// console.log(`\n\n`);
// ========================
