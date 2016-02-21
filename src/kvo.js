var KVO = function() { 
	this.bound = {};
	this.observer = {};
};

KVO.prototype.setKey = "_kvo";

KVO.prototype.didSet = function(id, prop, value) {

};

KVO.prototype.didGet = function(id, prop, value) {
	
};

KVO.prototype.wrapSetter = function(id, prop, setter) {
	var self = this;

	return function(value) {
		setter.call(this, value);
		self.didSet(this, prop, value);
	};
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
	var self = this;

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
	if(this.isBound(obj) === false) {
		this.bind(obj);
	}

	var hasSet = hasGet = false;

	var descriptor = Object.getOwnPropertyDescriptor(obj, prop);
	if(typeof descriptor !== "undefined") {
		var hasSet = typeof descriptor.set !== "undefined";
		var hasGet = typeof descriptor.get !== "undefined";

		if((hasSet && !hasGet) || (hasGet && !hasSet)) {
			console.dir(obj);
			throw new Error("Must have both a setter and a getter for prop ("+prop+")");
			return false;
		}
	}

	var _kvo = this.setKey;
	if(typeof obj[_kvo][prop] === "undefined") {
		obj[_kvo][prop] = obj[prop];
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

KVO.prototype.isBound = function(obj) {
	var _kvo = this.setKey;
	if(typeof obj[_kvo] === "undefined") {
		return false;
	}
	
	var id = obj[_kvo]["_kvoid"];
	return typeof this.bound[id] !== "undefined";
};

KVO.prototype.bind = function(obj) {
	var id;
	do {
		id = Math.random().toString(36).substr(2, 5);
	}while(typeof this.bound[id] !== "undefined")

	var _kvo = this.setKey;
	obj[_kvo] = { "_kvoid":id }; 
	this.bound[id] = obj;
}

