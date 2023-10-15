import { fileURLToPath } from 'url';
import path, { dirname } from 'path';
import fs from 'fs';
import { genDiff } from '../src/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const getFixturePath = (filename) => path.join(__dirname, '..', '__fixtures__', filename);
const readFile = (filename) => fs.readFileSync(getFixturePath(filename), 'utf-8');

// console.log(getFixturePath('expected.txt'));
// console.log(__filename);
// console.log(__dirname);
// console.log(`\n\n`)

test('compare files with several differencies', () => {
  const result = readFile('expected.txt');
  const filepath1 = getFixturePath('file1.json');
  const filepath2 = getFixturePath('file2.json');

  const actual = genDiff(filepath1, filepath2);

  expect(result).toEqual(actual);
});
