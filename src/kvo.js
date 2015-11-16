var KVO = function() { };
KVO.prototype.setKey = "_kvo";
KVO.prototype.defaultSetter = function(obj, prop) {
	return KVO.defaultSetter(this, obj, prop);
};

KVO.prototype.defaultGetter = function(obj, prop) {
	return KVO.defaultGetter(this, obj, prop);
};

KVO.prototype.generateSetter = function(obj, prop) {
	return KVO.generateSetter(this, obj, prop);
};

KVO.prototype.convert = function(obj, prop) {
	return KVO.convert(this, obj, prop);
};

KVO.prototype.setup = function(obj) {
	return KVO.setup(this, obj);
};

KVO.defaultSetter = function(kvo, obj, prop) {
	var _kvo = kvo.setKey;

	return function(value) {
		this[_kvo][prop] = value;
		return value;
	}.bind(obj);
};

KVO.defaultGetter = function(kvo, obj, prop) {
	var _kvo = kvo.setKey;

	return function() {
		return this[_kvo][prop];
	}.bind(obj);
};

KVO.generateSetter = function(kvo, obj, prop) {
	var descriptor = Object.getOwnPropertyDescriptor(obj, prop);
	var setter = kvo.defaults.setter(obj, prop);

	if( !_.isUndefined(descriptor) && !_.isUndefined(descriptor.set) ) {
		var oldSetter = descriptor.set;

		return function(value) {
			oldSetter(value);
			setter(value);
		};
	}

	return setter;
};

KVO.convert = function(kvo, obj, prop) {
	var setter, getter, oldSetter;
	var _kvo = kvo.setKey;
	kvo.setup(obj);

	obj[_kvo][prop] = "";

	var setter = kvo.defaultSetter(obj, prop);
	var getter = kvo.defaultGetter(obj, prop);

	Object.defineProperty(obj, prop, { 
		set: setter,
		get: getter
	});
};

KVO.setup = function(kvo, obj) {
	var _kvo = kvo.setKey;

	if(_.isUndefined(obj[_kvo])) {
		obj[_kvo] = {};
	}
}

