function get_options(source, scope, attribute_name) {
	var options = {};

	for(var option_name in source) {
		if(source.hasOwnProperty(option_name)) {
			var message_type = scope.__find_message_type(option_name),
					option_value = source[option_name];
		
			if(message_type) {
				var value_type = scope.__find_value_type(option_value);
				if(!value_type) {
					throw new Error('value_type: "' + option_value + '" is undefined.');
				}
			 	options.message_type = message_type;
			 	options.value_type = value_type;
			 	continue;
			}
			options[option_name] = option_value;
		}
	}
	if(!options.message_type) {
		throw new Error('No message_type set in attribute: "' + attribute_name + '".');
	}
	return options;
}

//	Attribute function. Will initialize the scope with
//	the needed functions.
function attribute(name, source, message_scope) {
	var options = get_options(source, message_scope, name),
			value_type = options.value_type,
			message_type = options.message_type;

	options.value_type = null;
	options.message_type = null;

	message_type(name, value_type, options, message_scope);
	//message_scope.__set_attribute_info()
}


module.exports = attribute;
