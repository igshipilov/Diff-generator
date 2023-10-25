import _ from 'lodash';
import path from 'path';

// ======= для тестов ===========
// import { getData } from './index.js';
// import { buildTree } from '../buildTree.js';
// ==============================

const correctValue = (value) => {
  if (_.isObject(value)) {
    return '[complex value]';
  }

  if (Array.isArray(value)) {
    const result = value.map((node) => (_.isPlainObject(node) ? '[complex value]' : correctValue(node)));
    return result;
  }
  const correctedValue = typeof value === 'string' ? `'${value}'` : value;

  return correctedValue;
};

export default (data) => {
  const iter = (arr, propPath) => {
    const result = arr.flatMap((node) => {
      const { key } = node;
      const { value } = node;
      const { stat } = node;

      const propertyPath = path.join(propPath, key);
      const formattedPath = propertyPath.replaceAll('/', '.');
      const curentValue = correctValue(value);

      switch (stat) {
        case 'unchanged': return '';
        case 'nested': return iter(value, formattedPath);
        case 'removed': return `Property '${formattedPath}' was ${stat}`;
        case 'added': return `Property '${formattedPath}' was ${stat} with value: ${curentValue}`;
        case 'updated': {
          const { valueOld } = node;
          const { valueNew } = node;

          const valueOldFormatted = correctValue(valueOld);
          const valueNewFormatted = correctValue(valueNew);

          return `Property '${formattedPath}' was ${stat}. From ${valueOldFormatted} to ${valueNewFormatted}`;
        }
        default: throw new Error(`Unknown status ${stat}`);
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
