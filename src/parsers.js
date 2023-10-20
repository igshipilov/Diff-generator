import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';

const getFilePath = (fileName) => {
  const currentDirectory = process.cwd();
  const filePath = path.resolve(currentDirectory, fileName);

  return filePath;
};

const getFileContent = (file) => fs.readFileSync(getFilePath(file), 'utf-8');

const getParsedFile = (file) => {
  const ext = path.extname(file);

  switch (ext) {
    case '.yaml': return yaml.load(getFileContent(file));
    case '.yml': return yaml.load(getFileContent(file));
    default: return JSON.parse(getFileContent(file));
  }
};



// const getParsedFile = (file) => {
//   const ext = path.extname(file);

//   switch (ext) {
//     case '.yaml': return yaml.load(getFileContent(file));
//     case '.yml': return yaml.load(getFileContent(file));
//     default: return JSON.parse(getFileContent(file));
//   }

//   // if (file.includes('.json')) {
//   //   return JSON.parse(getFileContent(file))
//   // }
//   // if (file.includes('.yaml') || file.includes('.yml')) {
//   //   return yaml.load(getFileContent(file))
//   // }
// };

// const getParsedFile = (file) => {
//   const pathExtname = path.extname(file);
//   if (pathExtname === '' || pathExtname === '.json') {
//     return JSON.parse(getFileContent(file))
//   }
//   if (pathExtname ==='.yaml' || pathExtname ==='.yml') {
//     return yaml.load(getFileContent(file))
//   }
// };



// console.log(getParsedFile('__fixtures__/file2.yml'))

export default getParsedFile;

// console.log(getParsedFile('__fixtures__/test.yaml'));


// ИСПОЛЬЗУЙ потом эту конструкцию:
// сурс: https://ru.hexlet.io/courses/js-polymorphism/lessons/dispatch-functions-by-key/theory_unit

// const mapping = {
//   yml: yaml.load,
//   json: JSON.parse,
// };

// const parse = (type, data) => mapping[type](data);