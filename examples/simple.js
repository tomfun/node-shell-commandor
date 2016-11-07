const commander = require('../index');

commands = [{
  command: 'echo 1 && sleep 1'
}, {
  command: 'ls -lA && sleep 1 && ls -l && sleep 1 && ls -l --color=always /var/log/'
}];

commander.run(commands);
