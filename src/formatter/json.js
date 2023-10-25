export default (data) => {
  const result = JSON.stringify(data, null, 2)
    .replaceAll('[', '{')
    .replaceAll(']', '}');

  return result;
};






// Проходимся по массиву `data` (см. `tree-2.txt`)

// Заносим в новый объект значение поля `key` (тем самым записываем имя ключа)

// В значение этого поля заносим содержимое поля `value`
// Если `stat === 'nested'`, тогда... 


// export default (data) => {


//   return result;
// };

