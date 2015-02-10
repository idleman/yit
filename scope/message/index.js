var scope = require('./../index');


//	Created for each new message type
function message_scope(name, source, parent) {

	var obj = Object.create(message_scope.prototype);
	if(obj.__exists(name)) {
		throw new Error('Duplicate property "' + name + '".');
	}

	obj.__name = name;
	obj.__message_type_tag_map = {};

	var malloc = function() {
		var instance = Object.create(malloc.prototype);
		instance._data = {};
		return instance;
	};
	malloc.prototype._get = function(tag) {
		if(!this._data[tag]) {
			this._data[tag] = [];
		}
		return this._data[tag];
	};
	
	malloc.__parse_map = {
		 // Each value_type will add there tag number here. Format:
		 //
		 //	1: 'tag' =>	compose([...]) => JSON object
	};
	
	malloc.__compose_map = {
		 // Each value_type will add there tag number here. Format:
		 //
		 //	1: 'tag' =>	compose([...]) => JSON object
	};

	malloc.__validate_map = {
		 // Each value_type will add there tag number here. Format:
		 //
		 //	1: 'tag' =>	compose([...]) => JSON object
	};

	malloc.prototype.compose = function() {
		var composed_data = {},
				tag_map = malloc.__compose_map;

		for(var tagID in tag_map) {
			if(tag_map.hasOwnProperty(tagID)) {
				var cb = tag_map[tagID],
						res = cb(this._get(tagID));

				if(res !== null) {
					//	Then null is returned should does it
					//	means it should not be composed at all.
					//	Probably because it has not been set at all.
					composed_data[tagID] = res;
				}
			}
		}
		return composed_data;
	};

	malloc.prototype.clear = function() {
		var data = this._data;
		for(var tag in data) {
			if(data.hasOwnProperty(tag)) {
				data[tag].length = 0;
			}
		}
	};

	var self = obj;
	malloc.prototype.parse = function(source) {
		var tag_map = malloc.__parse_map;
		
		for(var tag in tag_map) {
			if(tag_map.hasOwnProperty(tag)) {
				var list = this._get(tag);
				list.length = 0;
				var val = source[tag];

				if(source.hasOwnProperty(tag) && typeof val !== 'undefined' && val !== null) {
					var parse = tag_map[tag];
					parse(val, list, malloc); //, this.__get_message_type_by_tag(tag));
				}
			}
		}
	};

	malloc.prototype.validate = function() {
		// 	Implement tomorrow
		var data = this._data,
				tag_map = malloc.__validate_map;

		for(var tag in tag_map) {
			if(tag_map.hasOwnProperty(tag)) {
				var validate = tag_map[tag],
						val = this._get(tag);

				validate(val);
			}
		}
	};

	malloc.prototype.clone = function() {
		// 	Implement tomorrow
		var clone = malloc(),
				data = this.compose();

		clone.parse(data);
		return clone;
	};

	malloc.prototype.equals = function(message) {
		return JSON.stringify(this.compose()) === JSON.stringify(message.compose());
	};

	obj.__constructor = malloc;
	
	if(parent.__name) {
		parent.__get_constructor()[name] = malloc;
	} else {
		parent[name] = malloc;
	}
	
	//	When scope is invoked, will it automatically compile the scope
	return scope.call(obj, source, parent);
}

message_scope.prototype = Object.create(scope.prototype);

message_scope.prototype.__get_constructor = function() {
	return this.__constructor;
};

//	Return the message_type the item with [tag] has
//	will be used to dynamically re-create the object
message_scope.prototype.__set_message_type_by_tag = function(tag, o) {
	this.__message_type_tag_map[tag] = o;
};
message_scope.prototype.__get_message_type_by_tag = function(tag) {
	return this.__message_type_tag_map[tag];
};


//	The object is invoked 
message_scope.prototype.__compile = function() {
	//	Add message as a type
	var value_type = require('./../../value_type'),
			self = this;
	function custom_value_type() {
		var obj = Object.create(custom_value_type.prototype);
		value_type.apply(obj, arguments);
		return obj;
	}

	custom_value_type.prototype = Object.create(value_type.prototype);

	custom_value_type.prototype.validate_value = function(val) {
		var attribute_name = this.get_attribute_name();
		if(typeof val !== 'object') {
			var msg =	'Cannot assign ' + JSON.stringify(attribute_name) + ' to ' + JSON.stringify(val) + '. ' +
								'Value must be of type: "' + self.__name + '"';

			return new Error(msg);
		}
	};

	
	custom_value_type.prototype.parse_value = function(source, list) {
		var constructor = self.__get_constructor(),
				obj = constructor();
		obj.parse(source);
		return obj;
		//console.log('custom_value_type.prototype.parse_value: ' + JSON.stringify(source));
		//console.log('list: ' + list);
	};

	this.__parent.__add_value_type(this.__name, custom_value_type);
	var parser = this.__get_parser();
	parser(this.__get_source(), this);

	return this.__get_constructor();
};



module.exports = message_scope;