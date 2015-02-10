//	Base class for all base types (string, bool, number, date, ...)

function value_type(attribute_name, options, message) {
	var obj = ((this instanceof value_type)? this : Object.create(value_type.prototype));
	obj._attribute_name = attribute_name;
	obj._options = options;
	obj._message = message;
	var constructor = message.__get_constructor();

	constructor.__compose_map[options.tag] = obj.compose.bind(obj);
	constructor.__parse_map[options.tag] = obj.parse.bind(obj);

	//	The user may have set an invalid value
	//	we must check if it is valid
	var _default = obj.get_default_value()
	if(typeof _default !== 'undefined') {
		obj.validate_value(_default);
	}
	return obj;
}


//	Allocate this instance

value_type.prototype.get_options = function(a) {
	return this._options;
};
value_type.prototype.get_message = function(a) {
	return this._options;
};

value_type.prototype.get_attribute_name = function() {
	return this._attribute_name;
};

value_type.prototype.validate_value = function(a) {
	//	Throw exception if invalid. Overwritten in the derived classes
};

//value_type.prototype.validate = function(list) {
	//	Throw exception if invalid	
//};

value_type.prototype.compose_value = function(value) {
	if(typeof value === 'object') {
		return value.compose();
	}
	return value;
};

value_type.prototype.parse_value = function(source, construct_message) {
	if(typeof source === 'object') {
		throw new Error('Derived value_type must overwrite parse_value for none inbuilt data-types.');
	}
	return source;
};

value_type.prototype.malloc = function() {
	throw new Error('Malloc must be implemented in derived value_type(s)');
};


value_type.prototype.compose = function(values) {
	//	Automatically invoked from message constructor
	if(values.length === 0) {
		return null;
	}

	return values.map(this.compose_value.bind(this));
};

value_type.prototype.parse = function(value, list, constructor) {
	var self = this;
	//console.log('values: ' + JSON.stringify(value));

	if(typeof value.forEach === 'function') {
		value.forEach(function(val) {
			list.push(self.parse_value(val, constructor));
		});	
	} else {
		list.push(self.parse_value(value, constructor));
	}	
};

value_type.prototype.get_default_value = function() {
	var options = this.get_options(),
			_default = options['default'];

	return _default;
};


value_type.prototype.add_value = function(val, list) {
	this.validate_value(val);
	list.push(val);
};
/*
value_type.prototype.pop_value = function(val, list) {
	this.validate_value(val);
	return list.push(val);
};
*/
value_type.prototype.set_value = function(val, list, asArray, index) {
	var self = this;
	if(asArray) {
		if(!(typeof val === 'object' && typeof val.forEach === 'function')) {
			val = [val];
		}
		list.length = 0;

		val.forEach(function(o) {
			self.validate_value(o);
			list.push(o);
		});
	} else {
		this.validate_value(val);
		list.shift();
		list.unshift(val);
	}
};

value_type.prototype.get_value = function(list, asArray, index) {
	if(asArray) {
		return ((typeof index === 'undefined')? [].concat(list) : list[index]);
	}
	return ((list.length)? list[0] : this.get_default_value());
};


module.exports = value_type;