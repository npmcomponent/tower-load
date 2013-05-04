var load = 'undefined' == typeof window
  ? require('..')
  : require('tower-load'); // how to do this better?

var assert = require('assert');

var model = require('tower-model');

describe('load', function(){
  it('lazy load', function(){
    var path = require.resolve('../component.json');
    load.set(model, 'user', path);
    assert(1 === keys(load.paths).length);
    assert(1 === keys(load.keys).length);
    assert(1 === load.keys[path].length);

    var x = load.get(model, 'user');
    assert(x);
    // doesn't load a second time.
    x = load.get(model, 'user');
    assert(!x);

    assert(0 === keys(load.paths).length);
    assert(0 === keys(load.keys).length);
    assert(!load.keys[path]);
    assert(!load.fns[path]);
  });
});

function keys(obj) {
  return Object.keys(obj);
}