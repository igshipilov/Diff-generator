#!/usr/bin/env node

import { program } from "commander";
import path from 'path';
// import { cwd } from 'node:process'; // почему-то `process.cwd` работает без импорта `cwd`
import fs from 'fs';




// const test = (path1, path2) => {
//   console.log(`Hello ${path1}`);
//   console.log(`And ${path2}`);
// };


// Получить путь для двух файлов
// const getFilePath = (fileName1, fileName2) => {
//   const currentDirectory = process.cwd();
//   const filePath1 = path.resolve(currentDirectory, fileName1);
//   const filePath2 = path.resolve(currentDirectory, fileName2);

//   // console.log(currentDirectory);
//   // console.log(filePath);

//   console.log([filePath1, filePath2]);
//   return [filePath1, filePath2];
// };



// Получить путь для одного файла
const getFilePath = (fileName) => {
  const currentDirectory = process.cwd();
  const filePath = path.resolve(currentDirectory, fileName);

  return filePath;
};

const getFileContent = (file) => fs.readFileSync(getFilePath(file), 'utf-8');



program
  .name('gendiff')
  .version('0.0.1')
  .description('Compares two configuration files and shows a difference.')
  .option('-f, --format <type>', 'output format')
  .arguments('<filepath1> <filepath2>')
  .action(getFilePath)

program.parse();


