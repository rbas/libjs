/**
 * The Essentials of JavaScript
 *
 * This file contains common functions which I consider essential for everyday
 * JavaScript usage.
 *
 * @author Adam Hojka
 * @version 0.3
 ******************************************************************************/


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
 * Window session. Exists as long as the window itself lives.
 */
window.session = {
    /**
     * Is session initialized?
     */
    initialized: false,

    /**
     * Session data.
     */
    data: {},

    /**
     * Initialize session.
     *
     * @return {object} Provides fluent interface.
     */
    init: function() {
        var pairs = window.name.split('|');

        for (var i = 0; i < pairs.length; ++i) {
            if (pairs[i]) {
                var pair = pairs[i].split('=');

                this.data[unescape(pair[0])] = unescape(pair[1]);
            }
        }

        this.initialized = true;

        return this;
    },

    /**
     * Store a value into the session.
     *
     * @param {String} key   A key under which store the value.
     * @param {String} value A value to store.
     *
     * @return {object} Provides fluent interface.
     */
    set: function(key, value) {
        if (!this.initialized) {
            this.init();
        }

        if (!this.data[key] || this.data[key] != value) {
            this.data[key] = value;

            var pairs = [];

            for (var property in this.data) {
                if (this.data.hasOwnProperty(property)) {
                    pairs.push(escape(property) + '=' + escape(this.data[property]));
                }
            }

            window.name = pairs.join('|');
        }

        return this;
    },

    /**
     * Get a value from the session.
     *
     * @param {String} key A key under which the value is stored.
     *
     * @return {String} A value.
     */
    get: function(key) {
        if (!this.initialized) {
            this.init();
        }

        return this.data[key] || '';
    }
};

/**
 * Apply specified callback on every property (which is not in prototype)
 * of an object.
 *
 * @param {object} object   An object to iterate through.
 * @param {object} callback A callback to apply.
 * @param {object} context  A context to bind to the callback.
 *                          If none provided then window is used.
 */
window.each = function(object, callback, context) {
    for (var property in object) {
        if (object.hasOwnProperty(property)) {
            callback.call(context || window, object[property], property);
        }
    }
}

/**
 * Apply specified callback on every item of an array.
 *
 * @param {object} callback A callback to apply.
 * @param {object} context  A context to bind to the callback.
 *                          If none provided then window is used.
 */
Array.prototype.each = function(callback, context) {
    for (var i = 0; i < this.length; ++i) {
        callback.call(context || window, this[i], i);
    }
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
            arguments = args.concat(arguments);
        } else {
            arguments = args;
        }

        return func.apply(context, arguments);
    };
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



(function() {
    /**
     * Converts string to namespace (object hierarchy) and returns its last part.
     *
     * @return {Object} Last part of created namespace.
     */
    function toNamespace() {
        var result = window;
        var parts = this.split('.');
        var i = 0;
        var l = parts.length;
        var partName;
        for (i; i < l; ++i) {
            partName = parts[i];
            result = result[partName] =  result[partName] || {};
        }
        return result;
    }
    String.prototype.namespace = toNamespace;
})();
