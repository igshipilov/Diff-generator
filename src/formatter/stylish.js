import _ from 'lodash';

export const getStylish = (data) => {
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
        // const [currentStat, key] = Object.keys(obj);
        // const value = obj[key];
        // const stat = obj[currentStat];

        const key = obj.key;
        const value = obj.value;
        const stat = obj.stat;

        switch (stat) {
          case 'updated':
          // const [value1, value2] = value;

          const valueOld = obj.valueOld;
          const valueNew = obj.valueNew;
          
          const [deleted, added] = statSign(stat);

          const processValue = (val) => {
            if (_.isPlainObject(val)) {
              const entries = Object.entries(val);
              const result = entries.map(([key, value]) => `${currentIndent}${currentIndent}${key}: ${iter(processValue(value), depth + 1)}`);
            
              return ['{', ...result, `${bracketIndent}${bracketIndent}}`].join('\n');
            }

            return val;
          };
          
            return `${currentIndent}${deleted}${key}: ${processValue(valueOld)}${br}${currentIndent}${added}${key}: ${processValue(valueNew)}`;

          default: return `${currentIndent}${statSign(stat)}${key}: ${iter(value, depth + 1)}`;
        }
      });

      return ['{', ...arr, `${bracketIndent}}`]
        .join('\n');
    };

  return iter(data, 1);
};