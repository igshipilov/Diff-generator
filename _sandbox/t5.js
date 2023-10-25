import fs from 'fs';

const data = fs.readFileSync('__fixtures__/file1.json', 'utf-8');
const dataEmpty = fs.readFileSync('__fixtures__/fileEmpty1.json', 'utf-8');

// console.log(data);
// console.log(dataEmpty);
// console.log(JSON.parse(dataEmpty));
try { console.log(JSON.parse('')) } catch(a) {}