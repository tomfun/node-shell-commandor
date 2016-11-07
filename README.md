## node-shell-commandor

### javascript terminal multiplexer and command runner

### Example
```
const commander = require('node-shell-commandor');

commands = [{
  command: 'echo 1 && sleep 1'
}, {
  command: 'ls -lA && sleep 1 && ls -l && sleep 1 && ls -l --color=always /var/log/'
}];

commander.run(commands);
```
![example run](http://joxi.ru/xAe8EQYuYW1P52.jpg)

How to exit? Ctrl+c
