const commander = require('../index');

commands = [
  {command: 'echo 1 && sleep 1'},
  {command: 'echo 2 && sleep 2'},
  {command: 'echo 3 && sleep 3'},
  {command: 'echo 4 && sleep 4'},
  {command: 'echo 5 && sleep 5'},
  {command: 'echo 6 && sleep 6'},
  {command: 'echo 7 && sleep 7'},
  {command: 'echo -1'},
  {command: 'echo \'there will be error\' && zxcvasdfqwer'},
  {command: 'ls -lA && sleep 3 && ls -l && sleep 3 && ls -l --color=always /var/log/', opt: {name: 'ls'}},
];

commander.run(commands, {title: 'many commands'});
