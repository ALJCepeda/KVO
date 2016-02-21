var KVO = function() { };

KVO.prototype.setKey = "_kvo";

KVO.prototype.didSet = function(obj, prop, value) {

};

KVO.prototype.didGet = function(obj, prop, value) {
	
};

KVO.prototype.wrapSetter = function(obj, prop, setter) {
	return function(value) {
		setter.call(this, value);
		self.didSet(this, prop, value);
	}.bind(obj);
};

KVO.prototype.generateSetter = function(obj, prop) {
	var self = this;
	var _kvo = this.setKey;

	return function(value) {
		this[_kvo][prop] = value;
		self.didSet(this, prop, value);
	}.bind(obj);
};

KVO.prototype.wrapGetter = function(obj, prop, getter) {
	return function() {
		var value = getter.call(this);
		self.didGet(this, prop, value);
		return value;
	}.bind(obj);
};

KVO.prototype.generateGetter = function(obj, prop) {
	var self = this;
	var _kvo = this.setKey;

	return function() {
		var value = this[_kvo][prop];
		self.didGet(this, prop, value);
		return value;
	}.bind(obj);
};

KVO.prototype.convert = function(obj, prop) {
	var hasSet = hasGet = false;
	this.setup(obj, prop);

	var descriptor = Object.getOwnPropertyDescriptor(obj, prop);
	if(typeof descriptor !== "undefined") {
		var hasSet = descriptor.set !== "undefined";
		var hasGet = descriptor.get !== "undefined";

		if((hasSet && !hasGet) || (hasGet && !hasSet)) {
			throw new Error("Must have both a setter/getter or neither");
			return false;
		}
	}

	var setter, getter;
	if(hasSet && hasGet) {
		setter = this.wrapSetter(obj, prop, descriptor.set);
		getter = this.wrapGetter(obj, prop, descriptor.get);
	} else {
		setter = this.generateSetter(obj, prop);
		getter = this.generateGetter(obj, prop);
	}

	Object.defineProperty(obj, prop, { 
		set: setter,
		get: getter
	});
	return true;
};

KVO.prototype.setup = function(obj, prop) {
	var _kvo = this.setKey;

	if(typeof obj[_kvo] === "undefined") {
		obj[_kvo] = {};
	}

	if(typeof obj[_kvo][prop] === "undefined") {
		obj[_kvo][prop] = obj[prop];
	}
}

