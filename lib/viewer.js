'use strict';

const _ = require('lodash');
const blessed = require('blessed');

const streamMap = {
  0: 'out',
  1: 'output',
  2: 'error',
};

class Viewer {
  constructor(commands, opt = {}, boxOpt = {}) {
    this.opt = opt;
    this.boxOpt = boxOpt;
    this.commands = commands;

    this.output = '';
    this.error = '';
    this.out = '';
    this.exitCode = null;
    this.execError = null;
    this.cpHandler = null;

    this.selectedStream = 0;
    this.selectedIndex = -1;
  }

  createBox() {
    this.box = blessed.box(_.defaults(this.boxOpt, {
      top:          '10%',
      left:         '0',
      width:        '100%',
      height:       '90%',
      border:       {
        type: 'line'
      },
      tags:         false,
      hidden:       true,
      valign:       'bottom',
      scrollable:   true,
      alwaysScroll: true,
      mouse:        false,
      keys:         true,
      scrollbar:    {
        ch: '|',
        fg: '#f0a0a0'
      },
    }));
    this.box.on('keypress', (ch, key) => {
      if (key.name === 'right' || key.name === 'k') {
        if (this.selectedStream++ > 2) {
          this.selectedStream = 0;
        }
        this.refresh();
        this.box.screen.render();
        return;
      }
      if (key.name === 'left' || key.name === 'j') {
        if (this.selectedStream-- < 0) {
          this.selectedStream = 2;
        }
        this.refresh();
        this.box.screen.render();
        return;
      }
      if (key.name === 'escape') {
        this.selectedIndex = -1;
        this.refresh();
        this.box.screen.render();
        return;
      }
    });
  }

  formatOutput() {
    const com = this.commands[this.selectedIndex];
    if (!com) {
      this.box.setContent('');
      this.box.hide();
      return;
    }
    this.box.setContent(com[streamMap[this.selectedStream]]);
  }

  refresh() {
    this.formatOutput();
  }
}

module.exports.default = Viewer;
