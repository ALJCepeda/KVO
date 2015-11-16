var KVO = function() { };
KVO.prototype.setKey = "_kvo";
KVO.prototype.bound = {};

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

KVO.prototype.boundID = function(obj) {
	return KVO.boundID(this, obj);
}

KVO.prototype.setup = function(obj) {
	return KVO.setup(this, obj);
};

KVO.defaultSetter = function(kvo, id, prop) {
	return function(value) {
		kvo[id][prop] = value;
		return value;
	}.bind(obj);
};

KVO.defaultGetter = function(kvo, id, prop) {
	return function() {
		return this[id][prop];
	}.bind(obj);
};

KVO.generateSetter = function(kvo, obj, prop) {
	var setter;
	var descriptor = Object.getOwnPropertyDescriptor(obj, prop);

	if( !_.isUndefined(descriptor) && !_.isUndefined(descriptor.set) ) {
		setter = descriptor.set;
		console.dir(descriptor);
	} else {
		setter = kvo.defaultSetter(obj, prop);
	}

	setter = setter.bind(obj);

	return function(value) {
		//Do other kvo stuff
		console.log(prop + " has been set to: " + value);
		setter(value);
	};
};

KVO.convert = function(kvo, obj, prop) {
	var setter, getter, oldSetter;
	var _kvo = kvo.setKey;
	kvo.setup(obj);

	var setter = kvo.generateSetter(obj, prop);
	var getter = kvo.defaultGetter(obj, prop);

	Object.defineProperty(obj, prop, { 
		set: setter,
		get: getter
	});
};

function uid() {
	return Math.floor((1 + Math.random()) * 0x100000).toString(16);
}
KVO.boundID = function(kvo, obj) {
	for( var key in kvo.bound ) {
		var object = kvo.bound[key];

		if(object === obj) { return key; }
	}

	return false;
};

KVO.setup = function(kvo, obj) {
	var id = kvo.boundID(obj);

	if(id === false) {
		do {
			id = uid();
		}while( !_.isUndefined(kvo.bound[id]) )

		kvo.bound[id] = obj;
	}
	
	return id;
};

