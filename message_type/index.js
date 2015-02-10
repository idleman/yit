
//	message_type class defines a set of rules for each
//	message_type. There is currently three types
//	of message_type(s):
//
//	required:
//		Exact one value is accepted-
//	optional:
//		Zero or one value is accepted.
//	repeated
//		Any number of values is accepted.
function message_type(attributeName, value_type, options, scope) {
	var obj = ((this instanceof message_type)? this : Object.create(message_type.prototype));

	obj._attribute_name = attributeName;
	obj._value_type = value_type(attributeName, options, scope);
	obj._options = options;
	obj._scope = scope;

	var constructor = obj.get_constructor(),
			tag = obj.get_tag_id();

	if(typeof tag === 'undefined') {
		throw new Error('Message ' + scope.__name + '::' + attributeName + ' has no tag.');
	}
	//console.log('message_type(' + attributeName + ') __set_constructor_by_tag: ' + tag);
	scope.__set_message_type_by_tag(tag, this);
	

	constructor.__validate_map[tag] = obj.validate.bind(obj);
	obj.compile();
	return obj;
}

message_type.prototype.validate =  function() {
	return true;
};

message_type.prototype.get_attribute_name = function() {
	return this._attribute_name;
};
message_type.prototype.get_tag_id = function() {
	return this._options.tag;
};


message_type.prototype.get_constructor = function() {
	return this.get_message().__get_constructor();
};

message_type.prototype.get_value_type  = function() {
	return this._value_type;
};

message_type.prototype.get_message = function() {
	return this._scope;
};

message_type.prototype.compile = function() {
	return true;
};

module.exports = message_type;
/*

field_type.prototype.__compile = function(context) {
	var self = this,
			__constructor = context.__constructor;


	//console.log('self is: ' + require('util').inspect(self));
	function set_value(val) {
		//console.log('set_value to: ' + typeof val);
		validate_value(val);
		self.__value = val;
	}

	function get_value() {
		if(has_value()) {
			return self.__value;
		}

		switch(this.__type) {
			case "string":
			case "number":
				return self.__default;
			default:
				return  __constructor();
		}
	}

 	function has_value() {
 		if(typeof self.__value === 'undefined' || self.__value === null) {
			return false;
		}
		return true;
	}

	function clear_value() {
		self.__value = null;
	}

	function parse_value(source) {
		//console.log('parse source: ' + source);
		switch(self.__type) {
			case "string":
			case "number":
				return set_value(source);
			default:
				var obj = __constructor();
				console.log('parse_value(' + self.__name + ', ' + self.__type + '): ' + JSON.stringify(source));
				console.log('__constructor: ' + __constructor);
				obj.parse(source);
				self.__value = obj;
		}
	}

	function compose_value() {
		validate_value();

		if(!has_value()) {
			return;
		}
		switch(self.__type) {
			case "string":
			case "number":
				return self.__value;
			default:
				// value is another message
				//if(this.__value) {
				//console.log('has_value: ' + has_value());
				return self.__value.compose();
				//}
		}
	}

	function valid_type(val) {
		var type = typeof val;
		if(type === self.__type) {
			return true;
		}

		var fn = context.__find(self.__type);
		if(type === 'object' && typeof fn === 'function' && val instanceof fn) {
			return true;
		}
		return false;
	}



	function validate_value(val) {
		if(typeof val === 'undefined') {
			if(!has_value() && self.__required) {
				throw new Error('Required field "' + self.__name + '" is missing.')
			}
		} else {
			if(!valid_type(val)) {
				var type = typeof val;
				throw new Error('Invalid value: ' + JSON.stringify(type) + '. Field ' + JSON.stringify(self.__name) + ' must be of type: ' + JSON.stringify(self.__type));
			}
		}
	}
	

	
	
	
	if(__constructor.__tag_map[this.__tag]) {
		throw new Error('Field ' + this.__name + ' cannot use tag value ' + this.__tag + '.  It is already in use.');
	}
	__constructor.__tag_map[this.__tag] = this.__name;


	//fn: ' + fn);
	__constructor.prototype['set_' + this.__name] = set_value;
	__constructor.prototype[this.__name] = get_value;
	__constructor.prototype['has_' + this.__name] = has_value;
	__constructor.prototype['clear_' + this.__name] = clear_value;
	__constructor.prototype['validate_' + this.__name] = validate_value;
	__constructor.prototype['compose_' + this.__name] = compose_value;
	__constructor.prototype['parse_' + this.__name] = parse_value;


};

module.exports = field_type;*/