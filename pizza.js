const inquirer = require('inquirer');

var questions = [
  {
    type: 'list',
    name: 'droplets',
    message: 'What size do you need?',
    choices: ['Large', 'Medium', 'Small']
  }
];

inquirer.prompt(questions).then(function (answers) {
  console.log('\nOrder receipt:');
  console.log(JSON.stringify(answers, null, '  '));
});
