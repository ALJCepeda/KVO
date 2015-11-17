var KVO = function() { };
KVO.prototype.setKey = "_kvoID";
KVO.prototype.bound = {};
KVO.prototype.data = {};

KVO.prototype.get = function(ID, prop) {
	return KVO.get(this, ID, prop);
};

KVO.prototype.set = function(ID, prop, value) {
	return KVO.set(this, ID, prop, value);
};

KVO.prototype.generateSetter = function(obj, prop) {
	return KVO.generateSetter(this, obj, prop);
};

KVO.prototype.generateGetter = function(obj, prop) {
	return KVO.generateGetter(this, obj, prop);
};

KVO.prototype.defaultSetter = function(id, prop) {
	return KVO.defaultSetter(this, id, prop);
};

KVO.prototype.defaultGetter = function(id, prop) {
	return KVO.defaultGetter(this, id, prop);
};

KVO.prototype.convert = function(obj, prop) {
	return KVO.convert(this, obj, prop);
};

KVO.prototype.hasID = function(id) {
	return KVO.hasID(this, id);
};

KVO.prototype.setup = function(obj) {
	return KVO.setup(this, obj);
};

KVO.get = function(kvo, ID, prop) {
	if(!kvo.hasID(ID)) {
		return null;
	}

	return kvo.data[ID][prop];
};

KVO.set = function(kvo, ID, prop, value) {
	if(!kvo.hasID(ID)) {
		return null;
	}

	kvo.data[ID][prop] = value;
	return value;
};

KVO.defaultSetter = function(kvo, id, prop) {
	return function(value) {
		return kvo.set(id, prop, value);
	};
};

KVO.defaultGetter = function(kvo, id, prop) {
	return function() {
		return kvo.get(id, prop);
	};
};

KVO.generateSetter = function(kvo, obj, prop) {
	var setter;
	var _kvoID = kvo.setKey;

	var ID = obj[_kvoID]
	var descriptor = Object.getOwnPropertyDescriptor(obj, prop);
	
	if( !_.isUndefined(descriptor) && !_.isUndefined(descriptor.set) ) {
		setter = descriptor.set;
		console.dir(descriptor);
	} else {
		setter = kvo.defaultSetter(ID, prop);
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

	var id = kvo.setup(obj);

	var setter = kvo.generateSetter(obj, prop);
	var getter = kvo.defaultGetter(id, prop);

	Object.defineProperty(obj, prop, { 
		set: setter,
		get: getter
	});
};

function uid() {
	return Math.floor((1 + Math.random()) * 0x100000).toString(16);
}
KVO.hasID = function(kvo, id) {
	return !_.isUndefined(kvo.bound[id]);
};

KVO.setup = function(kvo, obj) {
	var _kvoID = kvo.setKey;
	var id = obj[_kvoID];

	if(_.isUndefined(id) || !kvo.hasID(id)) {
		do {
			id = uid();
		}while( !_.isUndefined(kvo.bound[id]) )

		kvo.bound[id] = obj;
		kvo.data[id] = {};
		obj[_kvoID] = id;
	}
	
	return id;
};

