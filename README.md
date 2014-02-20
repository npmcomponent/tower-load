*This repository is a mirror of the [component](http://component.io) module [tower/load](http://github.com/tower/load). It has been modified to work with NPM+Browserify. You can install it using the command `npm install npmcomponent/tower-load`. Please do not open issues or send pull requests against this repo. If you have issues with this repo, report it to [npmcomponent](https://github.com/airportyh/npmcomponent).*
# Tower Load

Lazy load modules for faster startup.

## Installation

node.js:

```bash
$ npm install tower-load
```

browser:

```bash
$ component install tower/load
```

## Example

```js
var load = require('tower-load')
  , model = require('tower-model');

// define
load(model, 'user', require.resolve('./lib/user'));
// actually require
load(model, 'user');
```

## Licence

MIT