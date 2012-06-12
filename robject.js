/**
 * Základní objekt, který zapouzdřuje práci s OOP v javascritpu.
 *
 * Díky rozšiřujícímu objektu Initializers můžeme objekty dědit
 * nebo mixovat.
 *
 * @param {Object} def Definice objektu.
 */
var RObject = function(def) {
	var constructor = def.hasOwnProperty('constructor') ? def.constructor : function() {};

	for (var name in RObject.Initializers) {
		RObject.Initializers[name].call(constructor, def[name], def);
	}

	return constructor;
}

/**
 * Metody usnadňující práci s objektama.
 */
RObject.Initializers = {
	/**
	 * Provede dědění předka.
	 *
	 * @param {Object} parent
	 */
	Extends: function (parent) {
		if (parent) {
			// Dočasný konstruktor.
			var T = function() {};
			// Uložíme si konstruktor do vlastní proměné.
			this._superClass = T.prototype = parent.prototype;
			this.prototype = new T();
		}
	},

	/**
	 * Vytovří mix všech objektů.
	 *
	 * @param {Array} mixins
	 * @param {Object} def
	 */
	Mixins: function(mixins, def) {
		/**
		 * Funkce vloží do prototype převzaté funkce z mixinu.
		 *
		 * @param {Object} mixin
		 */
		this.mixin = function(mixin) {
			for (var key in mixin) {
				if (key in RObject.Initializers) continue;
				this.prototype[key] = mixin[key];
			}
		}
		this.prototype.constructor = this;

		// Projdeme všechny vložené mixiny a zmixujeme je.
		var objects = [def].concat(mixins || []);
		for (var i = 0, l = objects.length; i < l; i++) {
			this.mixin(objects[i])
		}
	}
}
