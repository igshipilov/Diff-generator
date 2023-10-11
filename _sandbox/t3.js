import fs from 'fs';

const test = fs.readFileSync('/home/igshipilov/frontend-project-46/file1.json', 'utf-8');

console.log(test);
console.log(JSON.parse(test))