import _ from 'lodash';
import path from 'path';

const stringify = (value) => {
  if (_.isObject(value)) {
    return '[complex value]'; 
  } return typeof value === 'string' ? `'${value}'` : String(value);
};

export default (data) => {
  const iter = (arr, propPath) => {
    const result = arr.flatMap((node) => {
      const { key, value, stat } = node;

      const propertyPath = path.join(propPath, key);
      const formattedPath = propertyPath.replaceAll('/', '.');
      const curentValue = stringify(value);

      switch (stat) {
        case 'unchanged': return '';
        case 'nested': return iter(value, formattedPath);
        case 'removed': return `Property '${formattedPath}' was ${stat}`;
        case 'added': return `Property '${formattedPath}' was ${stat} with value: ${curentValue}`;
        case 'updated': {
          const { valueOld } = node;
          const { valueNew } = node;

          const valueOldFormatted = stringify(valueOld);
          const valueNewFormatted = stringify(valueNew);

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
