import path from 'path';
// import { cwd } from 'node:process'; // почему-то `process.cwd` работает без импорта `cwd`
import fs from 'fs';
import { getParsedFile } from "./parse.js";
import _ from 'lodash';


// Получить путь для одного файла
const getFilePath = (fileName) => {
  const currentDirectory = process.cwd();
  const filePath = path.resolve(currentDirectory, fileName);

  // console.log(filePath);
  return filePath;
};

console.log(getFilePath('file1.json'))


const getFileContent = (file) => fs.readFileSync(getFilePath(file), 'utf-8');


const genDiff = (file1, file2) => {
  const obj1 = _.cloneDeep(getParsedFile(file1));
  const obj2 = _.cloneDeep(getParsedFile(file2));

  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);

  // const values1 = Object.values(obj1);
  // const values2 = Object.values(obj2);

  // const entries1 = Object.entries(obj1);
  // const entries2 = Object.entries(obj2);

  const keys = _.union(keys1, keys2).sort(); // Массив со списком всех ключей из обоих объектов

  const indent = ' ';
  const indentCount = 2;
  const currentIndent = indent.repeat(indentCount);
  const br = '\n';

  // Итерируем массив ключей, проверяя наличие каждого ключа в переданных объектах и формируя diff строку
  const lines = keys
    .map((key) => {
        if (!Object.hasOwn(obj2, key)) {
          return `${currentIndent}- ${key}: ${obj1[key]}`;

        } else if (_.isPlainObject(obj1[key]) && _.isPlainObject(obj2[key])) {
          return `${currentIndent}${genDiff(obj1[key], obj2[key])}`;

        } else if (!Object.hasOwn(obj1, key)) {
          return `${currentIndent}+ ${key}: ${obj2[key]}`;

        } else if (obj1[key] !== obj2[key]) {
          return `${currentIndent}- ${key}: ${obj1[key]}${br}${currentIndent}+ ${key}: ${obj2[key]}`;

        } else if (obj1[key] === obj2[key]) {
          return `${currentIndent}${currentIndent}${key}: ${obj1[key]}`;

        }
    });

  return ['{',
    ...lines,
    '}'
  ].join(`${br}`);
};

// console.log(genDiff('file1.json', 'file2.json'))
export { genDiff, getFileContent };
