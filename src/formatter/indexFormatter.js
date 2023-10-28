import getStylish from './stylish.js';
import getPlain from './plain.js';
import getJSON from './json.js';

export default (diff, formatName) => {
  switch (formatName) {
    case 'plain': return getPlain(diff);
    case 'json': return getJSON(diff);
    default: return getStylish(diff);
  }
};
