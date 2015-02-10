var value_type = require('./../index');

function number_value_type() {
	var obj = Object.create(number_value_type.prototype);
	value_type.apply(obj, arguments);	
	return obj;
}

number_value_type.prototype = Object.create(value_type.prototype);

number_value_type.prototype.validate_value = function(val) {
	if(typeof val !== 'number') {
		var msg =	'Cannot assign ' + JSON.stringify(val) + ' to ' + JSON.stringify(this.get_attribute_name()) + '. ' +
							'Value must be of type: "number"';

		throw new Error(msg);
	}
};


value_type.prototype.malloc = function() {
	return 0;
};

module.exports = number_value_type;