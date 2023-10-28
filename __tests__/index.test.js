import { fileURLToPath } from 'url';
import path, { dirname } from 'path';
import fs from 'fs';
import genDiff from '../src/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const getFixturePath = (filename) => path.join(__dirname, '..', '__fixtures__', filename);
const readFile = (filename) => fs.readFileSync(getFixturePath(filename), 'utf-8');

describe('stylish', () => {
  test('compare complex JSON-files', () => {
    const desired = readFile('expectedStylish.txt');
    const filepath1 = getFixturePath('file1.json');
    const filepath2 = getFixturePath('file2.json');

    const actual = genDiff(filepath1, filepath2);

    expect(actual).toEqual(desired);
  });

  test('compare YAML-files', () => {
    const desired = readFile('expectedStylish.txt');
    const filepath1 = getFixturePath('file1.yaml');
    const filepath2 = getFixturePath('file2.yml');

    const actual = genDiff(filepath1, filepath2);

    expect(actual).toEqual(desired);
  });

  test('compare JSON-files with YAML-files', () => {
    const desired = readFile('expectedStylish.txt');
    const filepath1 = getFixturePath('file1.json');
    const filepath2 = getFixturePath('file2.yml');

    const actual = genDiff(filepath1, filepath2);

    expect(actual).toEqual(desired);
  });
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
});

describe('json', () => {
  test('compare complex JSON-files', () => {
    const desired = readFile('expectedJSON.txt');
    const filepath1 = getFixturePath('file1.json');
    const filepath2 = getFixturePath('file2.json');

    const actual = genDiff(filepath1, filepath2, 'json');

    expect(actual).toEqual(desired);
  });

  test('compare YAML-files', () => {
    const desired = readFile('expectedJSON.txt');
    const filepath1 = getFixturePath('file1.yaml');
    const filepath2 = getFixturePath('file2.yml');

    const actual = genDiff(filepath1, filepath2, 'json');

    expect(actual).toEqual(desired);
  });

  test('compare JSON-files with YAML-files', () => {
    const desired = readFile('expectedJSON.txt');
    const filepath1 = getFixturePath('file1.json');
    const filepath2 = getFixturePath('file2.yml');

    const actual = genDiff(filepath1, filepath2, 'json');

    expect(actual).toEqual(desired);
  });
});
