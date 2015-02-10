
var message_type = require('./../index');

function out_of_bounds(index, name) {
	var obj = Object.create(out_of_bounds.prototype);
	Error.call(obj, 'Cannot set ' + name + ' at index(' + index + '). It is out of bounds.');
	return obj;
}

out_of_bounds.prototype = Object.create(Error.prototype);

//	For required fields
function repeated_message_type() {
	var obj = Object.create(repeated_message_type.prototype);
	message_type.apply(obj, arguments);
	return obj;
}

repeated_message_type.prototype = Object.create(message_type.prototype);

repeated_message_type.prototype.compile = function() {
	//	The values is an array
	var constructor = this.get_constructor(),
			attribute_name = this.get_attribute_name(),
			tag = this.get_tag_id(),
			value_type = this.get_value_type();

	//	We must not lose this-scope within any function
	/*
	function add_value(val) {
		var list = this._get(tag);
		value_type.add_value(val, list);
	}
	function add_value(val) {
		var list = this._get(tag);
		value_type.add_value(val, list);
	}
	*/

	function set_value(index, val) {
		var list = this._get(tag);
		if(typeof val === 'undefined') {
			val = index;
			value_type.set_value(val, list, true);
		} else {
			if(list.length <= index || index < 0) {
				throw out_of_bounds(index, attribute_name);
			}
			value_type.set_value(val, list, true, index);
		}
		return this;
	}

	function add_value(val) {
		var list = this._get(tag);
		value_type.add_value(val, list);
		return this;
	}

	function has_value() {
		var data = this._get(tag);
		return 0 < data.length;
	}

	function get_value(index) {
		var list = this._get(tag);
		if(typeof index !== 'undefined' && list.length <= index || index < 0) {
			throw out_of_bounds(index, attribute_name);
		}
		
		return value_type.get_value(list, true, index);
	}

	function value_size() {
		var list = this._get(tag);
		return list.length;
	}


	constructor.prototype['set_' + attribute_name] = set_value;
	constructor.prototype['has_' + attribute_name] = has_value;
	/*constructor.prototype[attribute_name + '_push_front'] = value_push_front;
	constructor.prototype[attribute_name + '_push_back'] = value_push_back;
	constructor.prototype[attribute_name + '_pop_front'] = value_pop_front;
	constructor.prototype[attribute_name + '_pop_back'] = value_pop_back;*/
	constructor.prototype['add_' + attribute_name] = add_value;



	constructor.prototype[attribute_name + '_size'] = value_size;
	constructor.prototype[attribute_name] = get_value;
};


module.exports = repeated_message_type;