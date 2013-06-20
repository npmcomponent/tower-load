
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
 * Map of path to `fn`.
 */

exports.fns = {};

/**
 * Lazy-load a module.
 *
 * This is something like an IoC container.
 * Make sure the `api.toString()` is unique.
 *
 * @param {Function} api An api.
 * @param {String} key A unique key.
 * @param {Path} path Full `require.resolve(x)` path.
 * @api public
 */

function load(api, key, path) {
  return undefined === path
    ? exports.get(api, key)
    : exports.set.apply(exports, arguments);
}

/**
 * Get a module.
 *
 * @param {Function} api An api.
 * @param {String} key A unique key
 * @return {Function} A module.
 * @api public
 */

exports.get = function(api, key){
  var path = exports.paths[api.name + '.' + key];
  if (path) {
    var fn = exports.fns[path];
    if (fn) return fn();
  }
}

/**
 * Define how to lazy-load a module.
 *
 * @chainable
 * @param {Function} api An api.
 * @param {String} key A unique key.
 * @param {Path} path Full `require.resolve(x)` path.
 * @return {Function} exports The main `load` function.
 * @api public
 */

exports.set = function(api, key, path){
  var pathKey = api.name + '.' + key;
  if (!exports.paths[pathKey]) {
    exports.paths[pathKey] = path;
    (exports.keys[path] || (exports.keys[path] = [])).push(pathKey);
    if (!exports.fns[path]) {
      exports.fns[path] = requireFn(path, Array.prototype.slice.call(arguments, 3));
    }
  }
  return exports;
};

/**
 * Clear all modules.
 *
 * @param {Path} path Full `require.resolve(x)` path.
 * @api public
 */

exports.clear = function(path){
  for (var i = 0, n = exports.keys[path].length; i < n; i++) {
    delete exports.paths[exports.keys[path][i]];
  }
  exports.keys[path].length = 0;
  delete exports.keys[path];
  delete exports.fns[path];
};

/**
 * Return module function results.
 *
 * @param {Path} path Full `require.resolve(x)` path.
 * @param {Array} args Module function arguments array.
 * @return {Mixed} Module function return value.
 */

function requireFn(path, args) {
  return function(obj) {
    // remove all listeners
    exports.clear(path);

    var result = require(path);

    if ('function' === typeof result) {
      //args.unshift(obj);
      result.apply(result, args);
    }
    
    args = undefined;
    return result;
  }
}