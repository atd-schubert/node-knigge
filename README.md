# Knigge
### A forker tool for node.js

## How to install

```bash
npm install github:atd-schubert/node-knigge
```

## How to implement

#### Main script example
```js
var Knigge = require('knigge');

var fork = Knigge({
    path: __dirname + 'path/to/script.js',
    arguments: ['first', 'second'],
    options: {
    silent: true}
});

fork.fork.on('message', function (data) {
  console.log('Message from fork: ', data);
});

fork.fork.on('exit', function (exitCode) {
  console.log('Fork ended with exit code', exitCode);
});

fork.start();
```

#### Fork script example

```js
process.send({
    thisIs: 'the message, object'
});
```
