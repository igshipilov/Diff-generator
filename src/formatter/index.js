// index.js (ИЛИ indexFormatter.js ?)
import fs from 'fs';
import path from 'path';
import parse from '../parsers.js';
import buildTree from '../buildTree.js';
import getStylish from './stylish.js';
import getPlain from './plain.js';
import getJSON from './json.js';

const getFileType = (filepath) => path.extname(filepath).replaceAll('.', '') || 'json';
const buildFullPath = (filepath) => path.resolve(process.cwd(), filepath);
const getData = (filepath) => parse(getFileType(filepath), fs.readFileSync(filepath, 'utf-8'));

const formatDiff = (diff, formatName) => {
  switch (formatName) {
    case 'plain': return getPlain(diff);
    case 'json': return getJSON(diff);
    default: return getStylish(diff);
  }
};

export const genDiff = (pathFile1, pathFile2, formatName = 'stylish') => {
  const dataFile1 = getData(buildFullPath(pathFile1));
  const dataFile2 = getData(buildFullPath(pathFile2));
  const diff = buildTree(dataFile1, dataFile2);

  return formatDiff(diff, formatName);
};

// console.log(buildFullPath('file1.json'));
// console.log(process.cwd());
// console.log(genDiff('__fixtures__/file1.json', '__fixtures__/file2.json'));

export { getData };
