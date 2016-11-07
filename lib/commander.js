'use strict';

const _ = require('lodash');
const cp = require('child_process');
const blessed = require('blessed');


class Command {
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
  }

  createBox() {
    this.box = blessed.box(_.defaults(this.boxOpt, {
      right: '0',
      // left: '0',
      width: '200',
      height: '50%',
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
  }

  formatCommand(com) {
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
    _.each(this.commands, (com) => {
      cont = `${cont}\n${this.formatCommand(com)}`;
    });
    this.box.setContent(cont);
  }
}

module.exports.default = Command;
