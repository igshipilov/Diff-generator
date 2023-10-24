import { fileURLToPath } from 'url';
import path, { dirname } from 'path';
import fs from 'fs';
import { genDiff } from '../src/formatter/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const getFixturePath = (filename) => path.join(__dirname, '..', '__fixtures__', filename);
const readFile = (filename) => fs.readFileSync(getFixturePath(filename), 'utf-8');

// console.log(getFixturePath('expected.txt'));
// console.log(__filename);
// console.log(__dirname);
// console.log(`\n\n`)

// console.log(readFile('myExpectedIntermediate.txt'))

// test('genDiff before formatting', () => {

//   const filepath1 = getFixturePath('gdFile1.json');
//   const filepath2 = getFixturePath('gdFile2.json');

//   const desired = [
//     { stat: 'added', follow: false },
//     { stat: 'unchanged', setting1: "Value 1" },
//     { stat: 'deleted', setting2: 200},
//     { stat: 'changed', setting3: [true, null] },
//     { stat: 'added', setting4: "blah blah"},
//     { stat: 'added', setting5: 
//         { key5: 'value5' }
//     }
//   ];

//   const actual = genDiff(filepath1, filepath2);

//   expect(actual).toEqual(desired);
// });


// test('compare simple JSON-files', () => {
//   const desired = readFile('myExpectedFinal.txt');
//   const filepath1 = getFixturePath('gdFile1.json');
//   const filepath2 = getFixturePath('gdFile2.json');

//   const actual = genDiff(filepath1, filepath2);

//   expect(actual).toEqual(desired);
// });

describe('stylish', () => {
  test('compare complex JSON-files', () => {
    const desired = readFile('expected.txt');
    const filepath1 = getFixturePath('file1.json');
    const filepath2 = getFixturePath('file2.json');
  
    const actual = genDiff(filepath1, filepath2);
  
    expect(actual).toEqual(desired);
  });
  
  
  test('compare YAML-files', () => {
    const desired = readFile('expected.txt');
    const filepath1 = getFixturePath('file1.yaml');
    const filepath2 = getFixturePath('file2.yml');
  
    const actual = genDiff(filepath1, filepath2);
  
    expect(actual).toEqual(desired);
  });
  
  test('compare JSON-files with YAML-files', () => {
    const desired = readFile('expected.txt');
    const filepath1 = getFixturePath('file1.json');
    const filepath2 = getFixturePath('file2.yml');
  
    const actual = genDiff(filepath1, filepath2);
  
    expect(actual).toEqual(desired);
  });
  
  test('compare file without format', () => {
    const desired = readFile('expected.txt');
    const filepath1 = getFixturePath('file1');
    const filepath2 = getFixturePath('file2.yml');
  
    const actual = genDiff(filepath1, filepath2);
  
    expect(actual).toEqual(desired);
  });
  
  // test('compare empty files', () => {
  //   const desired = readFile('expectedEmpty.txt');
  //   const filepath1 = getFixturePath('fileEmpty1.json');
  //   const filepath2 = getFixturePath('fileEmpty2');
  
  //   const actual = genDiff(filepath1, filepath2);
  
  //   expect(actual).toEqual(desired);
  // });
  
  // test('compare empty JSON (empty objects)', () => {
  //   const desired = readFile('expectedEmpty.txt');
  //   const file1 = {};
  //   const file2 = {};
  
  //   const actual = genDiff(file1, file2);
  
  //   expect(actual).toEqual(desired);
  // });

});

describe('plain', () => {
  test('compare complex JSON-files', () => {
    const desired = readFile('expectedPlain.txt');
    const filepath1 = getFixturePath('file1.json');
    const filepath2 = getFixturePath('file2.json');
  
    const actual = genDiff(filepath1, filepath2, 'plain');
  
    expect(actual).toEqual(desired);
  });
  
  
  test('compare YAML-files', () => {
    const desired = readFile('expectedPlain.txt');
    const filepath1 = getFixturePath('file1.yaml');
    const filepath2 = getFixturePath('file2.yml');
  
    const actual = genDiff(filepath1, filepath2, 'plain');
  
    expect(actual).toEqual(desired);
  });
  
  test('compare JSON-files with YAML-files', () => {
    const desired = readFile('expectedPlain.txt');
    const filepath1 = getFixturePath('file1.json');
    const filepath2 = getFixturePath('file2.yml');
  
    const actual = genDiff(filepath1, filepath2, 'plain');
  
    expect(actual).toEqual(desired);
  });
  
  test('compare file without format', () => {
    const desired = readFile('expectedPlain.txt');
    const filepath1 = getFixturePath('file1');
    const filepath2 = getFixturePath('file2.yml');
  
    const actual = genDiff(filepath1, filepath2, 'plain');
  
    expect(actual).toEqual(desired);
  });
  
  // test('compare empty files', () => {
  //   const desired = readFile('expectedEmpty.txt');
  //   const filepath1 = getFixturePath('fileEmpty1.json');
  //   const filepath2 = getFixturePath('fileEmpty2');
  
  //   const actual = genDiff(filepath1, filepath2, 'plain');
  
  //   expect(actual).toEqual(desired);
  // });
  
  // test('compare empty JSON (empty objects)', () => {
  //   const desired = readFile('expectedEmpty.txt');
  //   const file1 = {};
  //   const file2 = {};
  
  //   const actual = genDiff(file1, file2, 'plain');
  
  //   expect(actual).toEqual(desired);
  // });

})
