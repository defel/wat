'use strict';

/**
 * Module dependencies.
 */

const _ = require('lodash');
const moment = require('moment');
const chalk = require('chalk');
const mdast = require('mdast');
const stripBadges = require('mdast-strip-badges');
const util = require('../util');

const github = {

  testPage(path) {
  },

  getPage(searchResult, callback) {
    callback = callback || {};
    const self = this;

    let details = this.parseSearchLink(searchResult.link);
    let readmeUrl = this.getRepoReadmeUrl(details);

    function request(urls, cb) {
      let url = urls.shift();
      if (url) {
        util.fetchRemote(url, function (err, data) {
          let results;
          if (!err) {

            var md = mdast().use(stripBadges);
            results = md.process(data);
            results = self.app.cosmetician.markdownToTerminal(data, {
              lineWidth: function () {
                return process.stdout.columns - 2;
              }
            });
            cb(undefined, results);
          } else {
            request(urls, cb);
          }
        });
      } else {
        cb('Not found.');
      }
    }

    request([readmeUrl.upper, readmeUrl.lower, readmeUrl.title, readmeUrl.out], callback);
  },

  parseSearchLink(url) {
    let res = String(url).split('//github.com/')[1];
    let result = {};
    if (res) {
      let parts = String(res).split('/') || [];
      let owner = parts[0];
      let name = parts[1];
      if (owner && name) {
        result = { owner, name };
      }
    }
    return result;
  },

  getRepoReadmeUrl(repo) {
    let result;
    if (repo) {
      result = {
        upper: `https://raw.githubusercontent.com/${repo.owner}/${repo.name}/master/README.md`,
        title: `https://raw.githubusercontent.com/${repo.owner}/${repo.name}/master/Readme.md`,
        lower: `https://raw.githubusercontent.com/${repo.owner}/${repo.name}/master/readme.md`,
        out: `https://raw.githubusercontent.com/${repo.owner}/${repo.name}/master/readme.markdown`
      }
    }
    return result;
  },

};

module.exports = function (app) {
  github.app = app;
  return github;
};
