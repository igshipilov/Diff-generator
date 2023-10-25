import fs from 'fs';
import genDiff from '../src/formatter/index.js'

const data = genDiff('__fixtures__/file1.json', '__fixtures__/file2.json', 'json');
// console.log(data);
// console.log(JSON.stringify(data));
console.log(JSON.parse(JSON.stringify(data, null, 2)));
// console.log(JSON.parse(data));

// const test = fs.readFileSync('__fixtures__/file1.json', 'utf-8');
// console.log(JSON.parse(test));