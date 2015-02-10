module.exports = {
	message: {
		"constant": {
			//	we create a constant "john" with value 1
			john_id: 1
		},
		//	Messages types is defined here. In this case person and address	
		address_info: {
			message: {
				zip: {
					data: {
						optional: 'number',
						tag: 1
					}
				}
			},
			// Next scope define its scope 

			country: {
				optional: "string",
				tag: 1
			},

			state: {
				optional: "string",
				tag: 2
			},

			city: {
				optional: "string",
				tag: 3
			},
			
			zip: {
				optional: "zip",
				tag: 4
			},

			address: {
				optional: "string",
				tag: 5
			}
		},

		note_type: {
			key: {
				required: "string",
				tag: 1
			},
			value: {
				required: "string",
				tag: 2
			}
		},

		person: {
			name: {
				required: "string",
				tag: 1,
				"default": "Unkown"
			},
			
			id: {
				required: "number",
				tag: 2,
				"default": -1
			},
			
			address: {
				optional: "address_info",
				tag: 3
			},

			note: {
				repeated: "note_type",
				tag: 4
			}
		}
	}
};