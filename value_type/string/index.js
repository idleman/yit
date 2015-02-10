var value_type = require('./../index');

function string_value_type() {
	var obj = Object.create(string_value_type.prototype);
	value_type.apply(obj, arguments);	
	return obj;
}

string_value_type.prototype = Object.create(value_type.prototype);

string_value_type.prototype.validate_value = function(val) {
	if(typeof val !== 'string') {
		var msg =	'Cannot assign ' + JSON.stringify(val) + ' to ' + JSON.stringify(this.get_attribute_name()) + '. ' +
							'Value must be of type: "string"';

		throw new Error(msg);
	}
};


value_type.prototype.malloc = function() {
	return '';
};

module.exports = string_value_type;