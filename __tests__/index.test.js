import { fileURLToPath } from 'url';
import path, { dirname } from 'path';
import fs from 'fs';
import genDiff from '../src/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const getFixturePath = (filename) => path.join(__dirname, '..', '__fixtures__', filename);
const readFile = (filename) => fs.readFileSync(getFixturePath(filename), 'utf-8');

// console.log(getFixturePath('expected.txt'));
// console.log(__filename);
// console.log(__dirname);
// console.log(`\n\n`)

test('genDiff', () => {

  const filepath1 = getFixturePath('gdFile1.json');
  const filepath2 = getFixturePath('gdFile2.json');

  const desired = [
    ['added', ['follow', false]],
    ['unchanged', ['setting1', 'Value 1']],
    ['deleted', ['setting2', 200]],
    ['changed', ['setting3', true], ['setting3', null]],
    ['added', ['setting4', 'blah blah']],
    ['added', ['setting5', ['unchanged', ['key5', 'value5']]]]
  ];

  const actual = genDiff(filepath1, filepath2);

  expect(actual).toEqual(desired);
});


// test('compare JSON-files', () => {
//   const result = readFile('expected.txt');
//   const filepath1 = getFixturePath('file1.json');
//   const filepath2 = getFixturePath('file2.json');

//   const actual = genDiff(filepath1, filepath2);

//   expect(result).toEqual(actual);
// });

// test('compare YAML-files', () => {
//   const result = readFile('expected.txt');
//   const filepath1 = getFixturePath('file1.yaml');
//   const filepath2 = getFixturePath('file2.yml');

//   const actual = genDiff(filepath1, filepath2);

//   expect(result).toEqual(actual);
// });

// test('compare JSON-files with YAML-files', () => {
//   const result = readFile('expected.txt');
//   const filepath1 = getFixturePath('file1.json');
//   const filepath2 = getFixturePath('file2.yml');

//   const actual = genDiff(filepath1, filepath2);

//   expect(result).toEqual(actual);
// });

// test('compare file without format', () => {
//   const result = readFile('expected.txt');
//   const filepath1 = getFixturePath('file1');
//   const filepath2 = getFixturePath('file2.yml');

//   const actual = genDiff(filepath1, filepath2);

//   expect(result).toEqual(actual);
// });

// test('compare empty files', () => {
//   const result = readFile('expectedEmpty.txt');
//   const filepath1 = getFixturePath('fileEmpty1');
//   const filepath2 = getFixturePath('fileEmpty2');

//   const actual = genDiff(filepath1, filepath2);

//   expect(result).toEqual(actual);
// });

// test('compare empty JSON (empty objects)', () => {
//   const result = readFile('expectedEmpty.txt');
//   const file1 = {};
//   const file2 = {};

//   const actual = genDiff(file1, file2);

//   expect(result).toEqual(actual);
// });
