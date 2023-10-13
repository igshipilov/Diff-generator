import { genDiff } from "../src/index.js";


test('compare files with several differencies', () => {
  const expected = 
`{
  - follow: false
    host: hexlet.io
  - proxy: 123.234.53.22
  - timeout: 50
  + timeout: 20
  + verbose: true
}`;
  const actual = genDiff('__fixtures__/file1.json', '__fixtures__/file2.json');

  expect(expected).toBe(actual)
});


test('compare similar files', () => {
  const expected = 
`{
    follow: false
    host: hexlet.io
    proxy: 123.234.53.22
    timeout: 50
}`;
  const actual = genDiff('__fixtures__/file1.json', '__fixtures__/file3.json');

  expect(expected).toBe(actual)
});


test('compare completely different files', () => {
  const expected = 
`{
  + bool: true
  + check: abc
  - follow: false
  + foobar: 42
  - host: hexlet.io
  - proxy: 123.234.53.22
  - timeout: 50
  + website: google.com
}`;
  const actual = genDiff('__fixtures__/file1.json', '__fixtures__/file4.json');

  expect(expected).toBe(actual)
});
