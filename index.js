
/**
 * Expose `load`.
 */

exports = module.exports = load;

/**
 * Map of `api + '.' + key` to absolute module path.
 */

exports.paths = {};

/**
 * Map of path to array of `api + '.' + key`.
 */

exports.keys = {};

/**
 * Lazy-load a module.
 *
 * This is something like an IoC container.
 * Make sure the `api.toString()` is unique.
 *
 * @param {Function} api
 * @param {String} key
 * @param {Path} path Full `require.resolve(x)` path
 * @api public
 */

function load(api, key, path) {
  return undefined === path
    ? exports.get(api, key)
    : exports.set.apply(exports, arguments);
}

exports.get = function(api, key){
  var path = exports.paths[api.name + '.' + key];
  if (path) {
    exports.clear(api, key, path);
    return require(path);
  }
}

/**
 * Define how to lazy-load a module.
 */

exports.set = function(api, key, path){
  var pathKey = api.name + '.' + key;
  if (!exports.paths[pathKey]) {
    exports.paths[pathKey] = path;
    (exports.keys[path] || (exports.keys[path] = [])).push(key);
    
    var args = Array.prototype.slice.call(arguments, 3);
    // XXX: need to add several listeners, but only run one
    api.once('define ' + key, function(x){
      // remove all listeners
      exports.keys[path].forEach(function(x){
        api.off('define ' + x);
      });

      var result = require(path);
      if ('function' === typeof result) {
        args.unshift(x);
        result.apply(result, args);
      }
    
      args = undefined;
    });
  }
  return exports;
}

exports.clear = function(api, key, path){
  delete exports.paths[api.name + '.' + key];
  for (var i = 0, n = exports.keys[path].length; i < n; i++) {
    delete exports.paths[exports.keys[path][i]];
  }
  exports.keys[path].length = 0;
  delete exports.keys[path];
}