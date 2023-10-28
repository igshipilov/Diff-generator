import fs from 'fs';
import path from 'path';
import parse from './parsers.js';
import buildTree from './buildTree.js';
import formatDiff from './formatter/indexFormatter.js';

const getFileType = (filepath) => path.extname(filepath).replaceAll('.', '') || 'json';
const buildFullPath = (filepath) => path.resolve(process.cwd(), filepath);
const getData = (filepath) => parse(getFileType(filepath), fs.readFileSync(filepath, 'utf-8'));

export default (pathFile1, pathFile2, formatName = 'stylish') => {
  const dataFile1 = getData(buildFullPath(pathFile1));
  const dataFile2 = getData(buildFullPath(pathFile2));
  const diff = buildTree(dataFile1, dataFile2);

  return formatDiff(diff, formatName);
};
