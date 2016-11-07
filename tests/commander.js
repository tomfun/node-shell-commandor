describe('test commander class', function () {
  let Commander;
  let screen;
  before(function () {
    const r = require('../lib/commander');
    Commander = r.default;
    Commander.should.be.Function();
  });
  it('test format', function () {
    const command = {
      command: 'echo 1',
      isRunning() {return false;},
      hasErrors() {return false;},
      isFailed() {return false;},
      isOk() {return true;},
      opt: {},
    };
    const formatCommand = Commander.prototype.formatCommand;
    formatCommand(command).should.be.equal('{right}{green-fg}echo 1{/green-fg}{/right}');
  });
  it('test format name', function () {
    const command = {
      command: 'echo 1',
      isRunning() {return true;},
      hasErrors() {return false;},
      isFailed() {return false;},
      isOk() {return false;},
      opt: {
        name: 'simple'
      },
    };
    const formatCommand = Commander.prototype.formatCommand;
    formatCommand(command).should.be.equal('{right}{green-bg}simple{/green-bg}{/right}');
  });
  it('test format errored', function () {
    const command = {
      command: 'echo 1',
      isRunning() {return true;},
      hasErrors() {return true;},
      isFailed() {return false;},
      isOk() {return false;},
      opt: {
        name: 'simple'
      },
    };
    const formatCommand = Commander.prototype.formatCommand;
    formatCommand(command).should.be.equal('{right}{green-bg}{red-fg}simple{/red-fg}{/green-bg}{/right}');
  });
});
