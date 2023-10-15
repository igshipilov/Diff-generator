import fs from 'fs';
import path from 'path';

const getFilePath = (fileName) => {
  const currentDirectory = process.cwd();
  const filePath = path.resolve(currentDirectory, fileName);

  return filePath;
};

const getFileContent = (file) => fs.readFileSync(getFilePath(file), 'utf-8');
const getParsedFile = (file) => JSON.parse(getFileContent(file));

export default getParsedFile;
