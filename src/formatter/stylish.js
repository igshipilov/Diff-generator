import _ from 'lodash';

const statSign = (stat) => {
  switch (stat) {
    case 'removed': return '- ';
    case 'added': return '+ ';
    case 'updated': return ['- ', '+ '];
    default: return '  ';
  }
};

export default (data) => {
  const iter = (node, depth) => {
    if (!_.isObject(node)) {
      return node;
    }

    const spacer = ' ';
    const spacerCount = 4;
    const indentCount = (spacerCount * depth) - 2;
    const currentIndent = spacer.repeat(indentCount);
    const bracketIndent = spacer.repeat(indentCount - (spacerCount / 2));
    const br = '\n';

    const arr = node.flatMap(({
      key, value, stat, valueOld, valueNew,
    }) => {
      switch (stat) {
        case 'updated': {
          const [deleted, added] = statSign(stat);

          const stringify = (val) => {
            if (_.isPlainObject(val)) {
              const entries = Object.entries(val);
              const result = entries.map(([objectKey, objectValue]) => `${currentIndent}${currentIndent}${objectKey}: ${iter(stringify(objectValue), depth + 1)}`);

              return ['{', ...result, `${bracketIndent}${bracketIndent}}`].join('\n');
            }

            return val;
          };

          return `${currentIndent}${deleted}${key}: ${stringify(valueOld)}${br}${currentIndent}${added}${key}: ${stringify(valueNew)}`;
        }
        default: return `${currentIndent}${statSign(stat)}${key}: ${iter(value, depth + 1)}`;
      }
    });

    return ['{', ...arr, `${bracketIndent}}`]
      .join('\n');
  };

  return iter(data, 1);
};
