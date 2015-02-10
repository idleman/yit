//	Default parser for the scope class
var make_scope = require('./../scope');

function define_constants(map, scope) {
	for(var name in map) {
		if(map.hasOwnProperty(name)) {
			scope[name] = map[name];
		}
	}
}

function parser(source, scope) {
	//console.log('parse source: ' + JSON.stringify(source));
	for(var directive in source) {
		if(source.hasOwnProperty(directive)) {

			//	if(typeof type !== 'string') {
			//		console.log('Expected object key to be of type string. Got ' + typeof type + '. Skipping.');
			//		continue;
			//	}
			var directive_value = source[directive];

			switch(directive) {
				case "message":
					var message = require('./../scope/message');
					for(var name in directive_value) {
						if(directive_value.hasOwnProperty(name)) {
							if(name === 'constant') {
								define_constants(directive_value[name], scope);
							} else {
								message(name, directive_value[name], scope);
							}
						}
					}
					break;
				case "constant":
					define_constants(directive_value, scope);
					break;
				default:
					//	We didnot found any keyword, so this is probably a attribute
					//	so lets add it to the scope
					var attribute = require('./../attribute');
					attribute(directive, directive_value, scope);
					//console.log('Unkown parser directive. Got ' + JSON.stringify(directive) + '. Skipping.');
			}
		}
	}
}

module.exports = parser;