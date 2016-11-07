'use strict';

const _ = require('lodash');
const blessed = require('blessed');
const Command = require('./lib/command').default;
const Commander = require('./lib/commander').default;

module.exports.run = function run(commands, opt = {title: 'my commander'}) {
  // Create a screen object.
  var screen = blessed.screen({
    smartCSR: true
  });

  screen.title = opt.title;


// Quit on Escape, q, or Control-C.
  screen.key(['escape', 'q', 'C-c'], function (ch, key) {
    return process.exit(0);
  });

// Focus our element.
  const commanderWidth = 20;
  const width = `${100 / commands.length | 0}%-${commands.length * 2 + commanderWidth}`;
  const coms = _.map(commands, (com, i) => {
    const boxOpt = _.extend({}, com.boxOpt || {}, {
      width,
      left: i ? `${i * 100 / commands.length | 0}%-${i * 2 + i * commanderWidth / commands.length | 0}` : '0',
    });
    const c = new Command(com.command, com.opt || {}, boxOpt);
    c.createBox();
    screen.append(c.box);
    return c;
  });
  const commander = new Commander(coms);
  commander.createBox();
  screen.append(commander.box);
  commander.box.focus();
  screen.render();

  const delayedRender = _.debounce(() => {
    commander.refresh();
    screen.render();
  }, 100);
  _.each(coms, (com) => {
    com.run(delayedRender);
  });
};