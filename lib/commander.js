'use strict';

const _ = require('lodash');
const blessed = require('blessed');


class Commander {
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

    this.selectedIndex = -1;
  }

  createBox() {
    this.box = blessed.box(_.defaults(this.boxOpt, {
      right: '0',
      // left: '0',
      width: '20%',
      height: '80%',
      border: {
        type: 'line'
      },
      tags: true,
      scrollable: true,
      alwaysScroll: true,
      mouse: true,
      keys: true,
      scrollbar: {
        ch: '|',
        fg: '#f0a0a0'
      },
    }));
      this.box.on('keypress', (ch, key) => {
        if (key.name === 'up' || key.name === 'k') {
          if (this.selectedIndex-- < 0) {
            this.selectedIndex = -1;
          }
          this.refresh();
          this.box.screen.render();
          return;
        }
        if (key.name === 'down' || key.name === 'j') {
          if (this.selectedIndex++ > this.commands.length) {
            this.selectedIndex = 0;
          }
          this.refresh();
          this.box.screen.render();
          return;
        }
        if (key.name === 'enter' && this.onSelectedChange) {
          this.onSelectedChange(this.selectedIndex);
          return;
        }
      });
  }

  formatSelectedCommand(com) {
    const line = com.opt.name || com.command;
    let bg = 'blue-bg';
    let fg = '';
    if (com.isRunning()) {
      if (com.hasErrors()) {
        fg = 'red-fg';
      }
    } else if (com.isFailed()) {
      fg = 'red-bg';
    } else if (com.isOk()) {
      fg = 'green-fg';
    }
    const bgc = bg ? `{/${bg}}` : '';
    const fgc = fg ? `{/${fg}}` : '';
    bg = bg ? `{${bg}}` : '';
    fg = fg ? `{${fg}}` : '';
    return `{right}${bg}${fg}${line}${fgc}${bgc}{/right}`;
  }

  formatCommand(com, i) {
    if (i === this.selectedIndex) {
      return this.formatSelectedCommand(com)
    }
    const line = com.opt.name || com.command;
    let bg = '';
    let fg = '';
    if (com.isRunning()) {
      if (com.hasErrors()) {
        fg = 'red-fg';
      }
      bg = 'green-bg';
    } else if (com.isFailed()) {
      bg = 'red-bg';
    } else if (com.isOk()) {
      fg = 'green-fg';
    }
    const bgc = bg ? `{/${bg}}` : '';
    const fgc = fg ? `{/${fg}}` : '';
    bg = bg ? `{${bg}}` : '';
    fg = fg ? `{${fg}}` : '';
    return `{right}${bg}${fg}${line}${fgc}${bgc}{/right}`;
  }

  refresh() {
    let cont = '';
    _.each(this.commands, (com, i) => {
      cont = `${cont}\n${this.formatCommand(com, i)}`;
    });
    this.box.setContent(cont);
  }
}

module.exports.default = Commander;
