const formattedValue = (value) => (typeof value === 'string' ? `'${value}'` : value);

console.log(formattedValue('hi'))
console.log(formattedValue(true))
console.log(formattedValue(42))