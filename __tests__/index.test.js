import { test, expect, describe } from '@jest/globals';
import { fileURLToPath } from 'url';
import path, { dirname } from 'path';
import fs from 'fs';
import genDiff from '../src/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const getFixturePath = (filename) => path.join(__dirname, '..', '__fixtures__', filename);
const readFile = (filename) => fs.readFileSync(getFixturePath(filename), 'utf-8');

const formats = [ 'json', 'yaml', 'yml' ];  

describe('genDiff should work correctly with', () => {
  test.each(formats)('%p:', (format) => {
    const filepath1 = getFixturePath(`file1.${format}`);
    const filepath2 = getFixturePath(`file2.${format}`);
    expect(genDiff(filepath1, filepath2)).toEqual(readFile('expectedStylish.txt'));
    expect(genDiff(filepath1, filepath2, 'stylish')).toEqual(readFile('expectedStylish.txt'));
    expect(genDiff(filepath1, filepath2, 'plain')).toEqual(readFile('expectedPlain.txt'));
    expect(genDiff(filepath1, filepath2, 'json')).toEqual(readFile('expectedJSON.txt'));
  })
});
