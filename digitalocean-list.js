const digitalocean = require('digitalocean');
const colors = require('colors');
const moment = require('moment');
const inquirer = require('inquirer');
const clipboardy = require('clipboardy');
const db = require('./lib/db');

(async function start() {
  let data = await db.find();
  const { token, fingerprint } = data;
  const client = digitalocean.client(token);

  let droplets = await client.droplets.list();

  const questions = [
    {
      type: 'list',
      name: 'droplet',
      message: 'There\'s your cool droplets',
      choices: droplets.map(droplet => droplet.name),
      filter: (val) => {
        return (droplets.find(droplet => droplet.name == val)).networks.v4[0].ip_address
      }
    }
  ];

  let answers = await inquirer.prompt(questions);
  clipboardy.writeSync(`ssh root@${answers.droplet}`);
  console.log(colors.bold.green('You can paste your ssh command anywhere now!'));

})();
