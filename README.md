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