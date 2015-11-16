var KVODescriptor = function() {

};

var KVO = function() {
	this.convert = function(obj, prop) {
		var _kvo = this.setKey;

		if(_.isUndefined(obj[_kvo])) {
			obj[_kvo] = {};
		}

		obj[_kvo][prop] = "";

		var setter = this.defaults.setter(obj, prop);
		var getter = this.defaults.getter(obj, prop);

		Object.defineProperty(obj, prop, { 
			set: setter,
			get: getter
		});
	};
};

KVO.prototype.setKey = "_kvo";
KVO.prototype.defaults = {
	setter:function(obj, prop) {
		var _kvo = KVO.prototype.setKey;

		return function(value) {
			this[_kvo][prop] = value;
			return value;
		}.bind(obj);
	},
	getter:function(obj, prop) {
		var _kvo = KVO.prototype.setKey;

		return function() {
			return this[_kvo][prop];
		}.bind(obj);
	}
};