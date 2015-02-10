
//	Base class for everything that creates a new scope
//
function scope(source, parent) {
	var obj = null;
	if(this instanceof scope) {
		obj = this;
	} else {
		obj = Object.create(scope.prototype);
	}

	obj.__parent = parent;
	obj.__source = source;
	obj.__value_types = {};
	obj.__message_types = {};

	if(!parent) {
		//	Root scope.

		//	Add basic value types. They will
		//	be inherited automatically.
		obj.__add_value_type('string', require('./../value_type/string'));
		obj.__add_value_type('number', require('./../value_type/number'));
		

		//	Add basic field types. They will
		//	be inherited automatically.
		obj.__add_message_type('required', require('./../message_type/required'));
		obj.__add_message_type('optional', require('./../message_type/optional'));
		obj.__add_message_type('repeated', require('./../message_type/repeated'));
	}

	//	Will parse the source and setup all
	//	needed constructors and so on.
	obj.__compile();
	return obj;
}

//	Add child scope [enum/message]
scope.prototype.__set_parser = function(parser) {
	this.__parser = parser;
};

scope.prototype.__get_parser = function() {
	if(!this.__parser) {
		this.__parser = require('./../parser');
	}
	return this.__parser;
};

scope.prototype.__get_source = function() {
	return this.__source;
};

scope.prototype.__get_parent = function() {
	return this.__parent;
};


//	Add child scope [enum/message]
/*scope.prototype.__add_scope = function(name, scope_instance) {
	if(this.__exists(name)) {
		console.log('Duplicate property "' + name + '". Skipping.');
		return false;
	}

	this[name] = scope_instance;
};*/

//	Set a value type on this scope
scope.prototype.__find_value_type = function(name) {
	var value_types = this.__value_types;

	if(value_types[name]) {
		return value_types[name];
	}

	if(this.__parent) {
		return this.__parent.__find_value_type(name);
	}
};



//	Set a value type on this scope
scope.prototype.__add_value_type = function(name, obj) {
	if(this.__find_value_type(name)) {
		throw new Error('value_type: ' + JSON.stringify(name) + ' already exists.');
	}
	this.__value_types[name] = obj;
};


scope.prototype.__find_message_type = function(name) {
	var message_types = this.__message_types;

	if(message_types[name]) {
		return message_types[name];
	}

	if(this.__parent) {
		return this.__parent.__find_message_type(name);
	}
};


scope.prototype.__add_message_type = function(name, obj) {
	if(this.__find_message_type(name)) {
		throw new Error('message_type: ' + JSON.stringify(name) + ' already exists.');
	}
	this.__message_types[name] = obj;
};

scope.prototype.__compile = function() {
	var parser = this.__get_parser(),
			source = this.__get_source();
	
	
	parser(source, this);
};


scope.prototype.__find = function(name) {
	if(typeof this[name] !== 'undefined') {
		return this[name];
	}
	
	if(this.__parent) {
		return this.__parent.__find(name);
	}
};


scope.prototype.__exists = function(name) {
	return !!this.__find(name);
};

/*

scope.prototype.__add_field = function(field) {
	var name = field.__name;
	if(this.__exists(name)) {
		console.log('Duplicate property "' + name + '". Skipping.');
		return false;
	}

	field.__compile(this);
};






scope.prototype.__add_message = function(name, definition) {
	if(this.__exists(name)) {
		console.log('Duplicate property "' + name + '". Skipping.');
		return false;
	}
	var parse = require('./../parse'),
			make_message_scope = require('./message'),
			scope = parse(definition, make_message_scope(this));

	scope.__compile(this, name);
	return true;
};


scope.prototype.__add_field = function(field) {
	var name = field.__name;
	if(this.__exists(name)) {
		console.log('Duplicate property "' + name + '". Skipping.');
		return false;
	}

	field.__compile(this);
};
*/


module.exports = scope;