'use strict';

const _ = require('lodash');
const cp = require('child_process');
const blessed = require('blessed');


class Command {
  constructor(command, opt = {}, boxOpt = {}) {
    this.opt = opt;
    this.boxOpt = boxOpt;
    this.command = command;

    this.output = '';
    this.error = '';
    this.out = '';
    this.exitCode = null;
    this.execError = null;
    this.cpHandler = null;
  }

  createBox() {
    this.box = blessed.box(_.defaults(this.boxOpt, {
      // top: '0',
      // left: '0',
      // width: '40%',
      // height: '50%',
      border: {
        type: 'line'
      },
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

  run(refresh) {
    try {
      this.cpHandler = cp.exec(this.command, this.opt);
    } catch (e) {
      this.cpHandler = {};
      process.nextTick(() => {
        this.execError = e;
        this.cpHandler = null;
        refresh()
      });
      return;
    }
    const cpHandler = this.cpHandler;

    cpHandler.stdout.on('data', (data) => {
      this.output += data;
      this.box.setContent(this.out += data);
      this.box.setScrollPerc(100);
      refresh();
    });

    cpHandler.stderr.on('data', (data) => {
      this.error += data;
      this.box.setContent(this.out += data);
      refresh();
    });

    cpHandler.on('close', (code) => {
      this.exitCode = code;
      this.box.setContent(this.out += `child process exited with code ${code}`);
      refresh();
    });

    cpHandler.on('error', (err) => {
      this.execError = err;
      this.box.setContent(this.out += `child process error ${err}`);
      refresh();
    });
  }

  isFailed() {
    return this.execError !== null;
  }

  isOk() {
    return this.exitCode === 0 && this.execError === null;
  }

  isRunning() {
    return this.cpHandler !== null && (this.exitCode === null || this.execError === null);
  }

  hasErrors() {
    return this.error !== '';
  }
}

module.exports.default = Command;
