const digitalocean = require('digitalocean');
const colors = require('colors');
const inquirer = require('inquirer');
const clipboardy = require('clipboardy');
const regions = require('./regions.json');
const sizes = require('./sizes.json');
const images = require('./images.json');
const db = require('./lib/db');

(async function start() {
  let data = await db.find();
  const { token, fingerprint } = data;
  const client = digitalocean.client(token);

  const questions = [
    {
      type: 'input',
      name: 'name',
      message: 'What\'s cool droplets name?',
      validate: function (value) {
        if (value.trim().length > 0) {
          return true;
        }

        return 'Please enter a droplet name';
      }
    },
    {
      type: 'list',
      name: 'image',
      message: 'Which distrubiton do you want?',
      choices: images.map(image => image.slug),
    },
    {
      type: 'list',
      name: 'region',
      message: 'Which region do you want?',
      choices: regions.map(region => region.name),
      filter: (val) => {
        return (regions.find(region => region.name == val)).slug
      }
    },
    {
      type: 'list',
      name: 'size',
      message: 'Which size do you want?',
      choices: sizes.map(size => size.slug),
    },
  ];

  let answers = await inquirer.prompt(questions);
  answers.ssh_keys = [fingerprint];

  client.droplets.create(answers, function(err, droplet) {
    if (err === null) {
      pollUntilDone(droplet.id, function() {
        console.log(colors.bold.green('Your droplet has ben created, you can paste anywhere.'));
      });
    } else {
      console.log(colors.bold.red(err.body.message));
    }
  });

  // Poll for non-locked state every 10s
  function pollUntilDone(id, done) {
    client.droplets.get(id, function(err, droplet) {
      if (!err && droplet.locked === false) {
        // we're done!
        done.call();
      } else if (!err && droplet.locked === true && droplet.networks.v4.length > 0) {
        // back off 10s more
        try {
          let ip = droplet.networks.v4[0].ip_address;
          clipboardy.writeSync(`ssh root@${ip}`);
          pollUntilDone(id, done);
        } catch (e) {
          setTimeout(function() {
            pollUntilDone(id, done);
          }, 3 * 1000);
        } finally {
          console.log(colors.grey('Wait for a few seconds..'));
        }

      } else {
        pollUntilDone(id, done);
      }
    });
  }
})();
