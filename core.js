/**
 * This file contains common functions.
 * @version 0.1
 * @author Adam Hojka
 */


/**
 * Convert an Array-like object to an ordinal Array object.
 *
 * @param {object} arrayLikeObject An Array-like object to convert.
 *
 * @return {Array} An ordinal Array object containing the same values as
 *                 the original Array-like object.
 */
window.A = function(arrayLikeObject) {
    return Array.prototype.slice.call(arrayLikeObject);
};

/**
 * Wrap a function into a closure with pre set context (and arguments).
 *
 * @return {object} Wrapped original function.
 */
Function.prototype.bind = function() {
    var func = this;
    var args = A(arguments);
    var context = args.shift();

    return function() {
        if (args.length < arguments.length) {
            arguments = A(arguments);
            arguments.splice(0, args.length);
            args = args.concat(arguments);
        }

        return func.apply(context, args);
    };
};

/**
 * Apply specified callback on every item of an array.
 *
 * @param {Function} callback A callback to apply.
 */
Array.prototype.each = function(callback) {
    for (var i = 0, l = this.length; i < l; ++i) {
        callback(this[i], i);
    }
};

/**
 * Call a method of specified name on every item of an array.
 * You can also specify an arguments of the method.
 */
Array.prototype.invoke = function() {
    var args = A(arguments);
    var method = args.shift();

    this.each(function(object) {
        if (object[method]) {
            object[method].apply(object, args);
        }
    });
};
