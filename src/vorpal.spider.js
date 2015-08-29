"use strict";

const spider = require('./spider');
const chalk = require('chalk');

module.exports = function(vorpal, options) {

  const parent = options.parent;

  vorpal
    .command('search [command...]', 'Searches for a command.')
    .action(function(args, cb){
      var command = (args.command || []).join(' ');
      let matches = parent.clerk.search(command);
      this.log(matches)
      cb();
    });

  vorpal
    .command('stackoverflow [command...]', 'Searches Stack Overflow.')
    .alias('so')
    .alias('stack')
    .action(function(args, cb){
      var command = (args.command || []).join(' ');
      var self = this;
      const sites = ['stackoverflow'];
      self.log(' ');

      function process(itm) {
        spider.stackoverflow.getPage(itm, function(err, text) {
          if (err) {
            self.log('Error: ', err);
          } else {
            self.log(text);
          }
          cb();
        });
      }

      spider.google(command, function(err, next, links){
        let wanted = spider.filterGoogle(links, ['stackoverflow']);
        let item = wanted.shift();
        if (item) {
          process(item);
        } else {
          self.log(chalk.yellow('  Wat couldn\'t find any matches on Stack Overflow.') + '\n  Try re-wording your question.\n');
          cb();
        }
      });
    });
}
