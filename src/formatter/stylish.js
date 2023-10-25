import _ from 'lodash';

export default (data) => {
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
        case 'removed': return '- ';
        case 'added': return '+ ';
        case 'updated': return ['- ', '+ '];
        default: return '  ';
      }
    };

    const arr = node.flatMap((obj) => {
      const { key } = obj;
      const { value } = obj;
      const { stat } = obj;

      switch (stat) {
        case 'updated': {
          const { valueOld } = obj;
          const { valueNew } = obj;
          const [deleted, added] = statSign(stat);

          const processValue = (val) => {
            if (_.isPlainObject(val)) {
              const entries = Object.entries(val);
              const result = entries.map(([objectKey, objectValue]) => `${currentIndent}${currentIndent}${objectKey}: ${iter(processValue(objectValue), depth + 1)}`);

              return ['{', ...result, `${bracketIndent}${bracketIndent}}`].join('\n');
            }

            return val;
          };

          return `${currentIndent}${deleted}${key}: ${processValue(valueOld)}${br}${currentIndent}${added}${key}: ${processValue(valueNew)}`;
        }
        default: return `${currentIndent}${statSign(stat)}${key}: ${iter(value, depth + 1)}`;
      }
    });

    return ['{', ...arr, `${bracketIndent}}`]
      .join('\n');
  };

  return iter(data, 1);
};
