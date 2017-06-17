#!/usr/bin/env node
const db = require('./lib/db');
const program = require('commander');
const inquirer = require('inquirer');
const colors = require('colors');

db.find()
  .then((doc) => {
    if (!doc) {
      const questions = [
        {
          type: 'input',
          name: 'token',
          message: 'What\'s digital ocean API token?',
          validate: function (value) {
            if (value.trim().length > 0) {
              return true;
            }

            return 'Please enter a API token';
          }
        },
        {
          type: 'input',
          name: 'fingerprint',
          message: 'What\'s digital ocean ssh fingerprint?',
          validate: function (value) {
            if (value.trim().length > 0) {
              return true;
            }

            return 'Please enter a ssh fingerprint';
          }
        },
      ];

      inquirer.prompt(questions)
        .then( async (attributes) => {
          let out = await db.insert(attributes);
          console.log(colors.bold.green('CLI APP INITIALIZED'));
          program
            .version('1.0.0')
            .command('create', 'create digitalocean droplet')
            .command('delete', 'delete digitalocean droplet')
            .command('list', 'list digitalocean droplets', {isDefault: true})
            .parse(process.argv);
        });
    } else {
      program
        .version('1.0.0')
        .command('create', 'create digitalocean droplet')
        .command('delete', 'delete digitalocean droplet')
        .command('list', 'list digitalocean droplets', {isDefault: true})
        .parse(process.argv);
    }
  })
