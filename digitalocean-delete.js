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
        return (droplets.find(droplet => droplet.name == val)).id
      }
    }
  ];

  let answers = await inquirer.prompt(questions);
  let out = await client.droplets.delete(answers.droplet)
  let deletedDroplet = (droplets.find(droplet => droplet.id == answers.droplet)).name;
  console.log(colors.green('Your cool droplet has ben deleted'), colors.bold.blue(deletedDroplet));
})();
