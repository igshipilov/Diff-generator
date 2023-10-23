import yaml from 'js-yaml';

const mapping = {
  json: JSON.parse || '',
  yaml: yaml.load,
  yml: yaml.load
};

export default (type, data) => mapping[type](data);
























// const getFilePath = (fileName) => {
//   const currentDirectory = process.cwd();
//   const filePath = path.resolve(currentDirectory, fileName);

//   return filePath;
// };

// console.log(getFilePath('__fixtures__/file1.json'));
// console.log(buildFullPath('__fixtures__/file1.json'));
// console.log(getData('__fixtures__/file1.yaml'));
// console.log(getData('file1.yaml'));
// console.log(fs.readFileSync('__fixtures__/file1.json', 'utf-8'))

// const getFileContent = (file) => fs.readFileSync(getFilePath(file), 'utf-8');



// const getParsedFile = (file) => { 
//   const type = path.extname(file).replaceAll('.', '') || 'json'
//   const data = getFileContent(file);

//   return mapping[type](data); 
// };

// export default getParsedFile;
