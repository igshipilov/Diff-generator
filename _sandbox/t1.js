import path from 'path';

console.log(
  path.resolve('foo/bar/test/one', './baz')
);

console.log(
  path.resolve('wwwroot', 'static_files/png/', '../gif/image.gif')
);

