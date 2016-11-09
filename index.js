'use strict';

const _ = require('lodash');
const blessed = require('blessed');
const Command = require('./lib/command').default;
const Commander = require('./lib/commander').default;
const Viewer = require('./lib/viewer').default;

module.exports.run = function run(commands, opt = {title: 'my commander'}) {
  // Create a screen object.
  var screen = blessed.screen({
    smartCSR: true
  });

  screen.title = opt.title;


// Quit on Escape, q, or Control-C.
  screen.key(['q', 'C-c'], function (ch, key) {
    Promise.all(_.map(coms, (com) => com.shutdown()))
      .catch((err) => {
        console.error(err);
        process.exit(1);
      })
      .then(() => process.exit(0));
  });

// Focus our element.
  const commanderWidth = 20;
  const width = `${(100 - commanderWidth) / commands.length | 0}%`;
  const coms = _.map(commands, (com, i) => {
    const boxOpt = _.extend({}, com.boxOpt || {}, {
      width,
      left: i ? `${i * (100 - commanderWidth) / commands.length | 0}%` : '0',
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

  const viewer = new Viewer(coms);
  viewer.createBox();
  screen.append(viewer.box);

  commander.onSelectedChange = (i) => {
    viewer.selectedIndex = i;
    viewer.box.show();
    viewer.box.focus();
    viewer.refresh();
    screen.render();
    screen.program.disableMouse();
  };

  const delayedRender = _.debounce(() => {
    commander.refresh();
    viewer.refresh();
    screen.render();
  }, 100);
  _.each(coms, (com) => {
    com.run(delayedRender);
  });
};