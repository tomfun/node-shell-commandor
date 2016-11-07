describe('test command class', function () {
  let Command;
  let screen;
  before(function () {
    const r = require('../lib/command');
    Command = r.default;
    Command.should.be.Function();
  });
  it('just run', function () {
    const echo = new Command('echo 1');
    echo.isRunning().should.be.equal(false);
    echo.box = {setContent() {}};
    echo.run();
    echo.isRunning().should.be.equal(true);
  });
  it('just fail', function (done) {
    const echo = new Command('echo 1', {uid: 33});
    echo.box = {setContent() {}};
    echo.isFailed().should.be.equal(false);
    echo.run(() => {
      echo.isFailed().should.be.equal(true);
      done();
    });
    echo.isRunning().should.be.equal(true);
  });
  it('run error', function (done) {
    const echo = new Command('tests/fail.sh');
    var content;
    echo.box = {setContent(c) {content = c;}};
    var callCounter = 0;
    function doneAfterTwoCall() {
      if (++callCounter == 2) {
        echo.isFailed().should.be.equal(false);
        echo.hasErrors().should.be.equal(true);
        echo.error.should.not.be.equal('');
        echo.out.should.not.be.equal('');
        echo.output.should.be.equal('');
        done()
      }
    }
    echo.hasErrors().should.be.equal(false);
    echo.isFailed().should.be.equal(false);
    echo.run(doneAfterTwoCall);
    echo.isRunning().should.be.equal(true);
  });
  it('run normal', function (done) {
    const echo = new Command('echo 1');
    var content;
    echo.box = {setContent(c) {content = c;}, setScrollPerc() {}};
    var callCounter = 0;
    function doneAfterTwoCall() {
      if (++callCounter == 2) {
        echo.isFailed().should.be.equal(false);
        echo.hasErrors().should.be.equal(false);
        echo.error.should.be.equal('');
        echo.out.should.not.be.equal('');
        echo.output.should.be.equal('1\n');
        done()
      }
    }
    echo.hasErrors().should.be.equal(false);
    echo.isFailed().should.be.equal(false);
    echo.run(doneAfterTwoCall);
    echo.isRunning().should.be.equal(true);
  });
});
