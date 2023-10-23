import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';

const getFilePath = (fileName) => {
  const currentDirectory = process.cwd();
  const filePath = path.resolve(currentDirectory, fileName);

  return filePath;
};

const getFileContent = (file) => fs.readFileSync(getFilePath(file), 'utf-8');

const mapping = {
  json: JSON.parse || '',
  yaml: yaml.load,
  yml: yaml.load
};

const getParsedFile = (file) => { 
  const type = path.extname(file).replaceAll('.', '') || 'json'
  const data = getFileContent(file);

  return mapping[type](data); 
};

export default getParsedFile;
