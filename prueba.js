const fs = require('fs');

fs.readFile('users_log.json', (err, data) => {
  if (err) throw err;
  let student = JSON.parse(data);
  let este = 'eyh';
  console.log(student.database[este]);
});

console.log('This is after the read call');
