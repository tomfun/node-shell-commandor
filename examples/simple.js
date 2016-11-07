const commander = require('../index');

commands = [{
  command: 'echo 1'
}, {
  command: 'echo 1 && echo 2 && sleep 1 && ls -lA && sleep 1 && ls -l && sleep 1 && ls -l --color=always /var/log/ && sleep 1 && echo -e \'1\\n2\\n3\''
}];

commander.run(commands);
