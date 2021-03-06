
var message_type = require('./../index');
//	For required fields
function optional_message_type() {
	var obj = Object.create(optional_message_type.prototype);
	message_type.apply(obj, arguments);
	return obj;
}

optional_message_type.prototype = Object.create(message_type.prototype);


optional_message_type.prototype.compile = function() {
	//	The values is an array
	var constructor = this.get_constructor(),
			attribute_name = this.get_attribute_name(),
			tag = this.get_tag_id(),
			value_type = this.get_value_type();

	//	We must not lose this-scope within any function
	function set_value(val) {
		var data = this._get(tag);
		value_type.set_value(val, data);
	}

	function has_value() {
		var data = this._get(tag);
		return 0 < data.length;
	}

	function get_value() {
		var data = this._get(tag);
		return value_type.get_value(data);
	}

	constructor.prototype['set_' + attribute_name] = set_value;
	constructor.prototype['has_' + attribute_name] = has_value;
	constructor.prototype[attribute_name] = get_value;
};


module.exports = optional_message_type;