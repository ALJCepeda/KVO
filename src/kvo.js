var KVO = function() { 
	this.bound = {};
	this.observers = {};
};

KVO.prototype.setKey = "_kvo";

KVO.prototype.do_didSet = function(id, prop, value) {
	var didSets = this.observers[id].didSet[prop];
	didSets = didSets.filter(function(entry) {
		entry[0](value);
		return entry[1] === false;
	});

	this.observers[id].didSet[prop] = didSets;
};

KVO.prototype.do_didGet = function(id, prop, value) {
	var didGets = this.observers[id].didGet[prop];
	didGets = didGets.filter(function(entry) {
		entry[0](value);
		return entry[1] === false;
	});

	this.observers[id].didGet[prop] = didGets;
};

KVO.prototype.on_didSet = function(obj, prop, func) {
	var _kvo = this.setKey
	var id = obj[_kvo]["_kvoid"];

	this.on_didSetID(id, prop, func);
};

KVO.prototype.once_didSet = function(obj, prop, func) {
	var _kvo = this.setKey
	var id = obj[_kvo]["_kvoid"];

	this.once_didSetID(id, prop, func);
};

KVO.prototype.on_didSetID = function(id, prop, func) {
	this.observers[id].didSet[prop].push([func, false]);
};

KVO.prototype.once_didSetID = function(id, prop, func) {
	this.observers[id].didSet[prop].push([func, true]);
};

KVO.prototype.on_didGet = function(obj, prop, func) {
	var _kvo = this.setKey
	var id = obj[_kvo]["_kvoid"];

	this.on_didGetID(id, prop, func);
};

KVO.prototype.once_didGet = function(obj, prop, func) {
	var _kvo = this.setKey
	var id = obj[_kvo]["_kvoid"];

	this.once_didGetID(id, prop, func);
};

KVO.prototype.on_didGetID = function(id, prop, func) {
	this.observers[id].didSet[prop].push([func, false]);
};

KVO.prototype.once_didGetID = function(id, prop, func) {
	this.observers[id].didGet[prop].push([func, true]);
};

KVO.prototype.wrapSetter = function(id, prop, setter) {
	var self = this;

	return function(value) {
		setter.call(this, value);
		self.do_didSet(id, prop, value);
	};
};

KVO.prototype.generateSetter = function(id, prop) {
	var self = this;
	var _kvo = this.setKey;

	return function(value) {
		this[_kvo][prop] = value;
		self.do_didSet(id, prop, value);
	};
};

KVO.prototype.wrapGetter = function(id, prop, getter) {
	var self = this;

	return function() {
		var value = getter.call(this);
		self.do_didGet(id, prop, value);
		return value;
	};
};

KVO.prototype.generateGetter = function(id, prop) {
	var self = this;
	var _kvo = this.setKey;

	return function() {
		var value = this[_kvo][prop];
		self.do_didGet(id, prop, value);
		return value;
	};
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
	var id = obj[_kvo]["_kvoid"];

	obj[_kvo][prop] = obj[prop];
	this.observers[id].didSet[prop] = [];
	this.observers[id].didGet[prop] = [];

	var setter, getter;
	if(hasSet && hasGet) {
		setter = this.wrapSetter(id, prop, descriptor.set);
		getter = this.wrapGetter(id, prop, descriptor.get);
	} else {
		setter = this.generateSetter(id, prop);
		getter = this.generateGetter(id, prop);
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
	var self = this;
	var id;
	do {
		id = Math.random().toString(36).substr(2, 5);
	}while(typeof this.bound[id] !== "undefined");

	var _kvo = this.setKey;
	obj[_kvo] = { "_kvoid":id }; 
	this.bound[id] = obj;

	this.observers[id] = {
		didSet:{},
		didGet:{}
	};

	obj.on_didSet = function(prop,func) {
		self.on_didSet(this, prop, func);
	}.bind(obj);

	obj.once_didSet = function(prop, func) {
		self.once_didSet(this, prop, func);
	}.bind(obj);

	obj.on_didGet = function(prop, func) {
		self.on_didGet(this, prop, func);
	}.bind(obj);

	obj.once_didGet = function(prop, func) {
		self.once_didGet(this, prop, func);
	}.bind(obj);
};

