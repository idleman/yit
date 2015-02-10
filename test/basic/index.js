var assert = require("assert"),
		yit = require(__dirname + '/../../index');

describe('basic', function() {
	var source = null,
			scope = null,
			person = null,
      address_type = null,
      note_type = null;


  describe('schema', function() {
    it('loading source', function() {
      source = require('./schema.js');
    });
    it('compile source', function() {
      scope = yit.parse(source);
      person = scope.person;
      address_info = scope.address_info;
      note_type = scope.note_type;
    });
    
    //console.log('returned scope from yit: ' + require('util').inspect(scope));    
  })
  describe('usage', function() {
    var serialized = null,
        john = null;


    it('#constructor', function() {
      john = person();
    });
    
    it('#has_name/set_name/name', function() {
      assert.equal(john.has_name(), false);
      john.set_name('John');
      assert.equal(john.has_name(), true);
      assert.equal(john.name(),'John');

      //  Type enforcement
      assert.throws(john.set_name.bind(john, 1));
    });

    it('#has_id/set_id/id', function() {
      assert.equal(john.has_id(), false);
      john.set_id(scope.john_id);
      assert.equal(john.has_id(), true);
      assert.equal(john.id(), 1);

      //  Type enforcement
      assert.throws(john.set_id.bind(john, '1'));
    });

    it('#has_address/set_address/address', function() {
      assert.equal(john.has_address(), false);

      var address = address_info(),
          zip = address_info.zip();

      zip.set_data(12345);
      address.set_country('Sweden');
      address.set_city('Stockholm');
      address.set_zip(zip);
      john.set_address(address);

      address = john.address();
      zip = address.zip();
      //console.log('serialized: ' + JSON.stringify(john.compose()));
      assert.equal(address.has_country(), true);
      assert.equal(address.has_city(), true);
      assert.equal(address.country(), 'Sweden');
      assert.equal(address.city(), 'Stockholm');
      assert.equal(zip.data(), 12345);
    });

    it('#has_note/set_note/add_note/get_note/note_size', function() {
      assert.equal(john.has_note(), false);
      assert.equal(john.note_size(), 0);
      assert.equal(john.note().length, 0);
      assert.throws(john.note.bind(john, 1));


      var note = note_type();
      note.set_key('key');
      note.set_value('value');

      //  We cannot set 
      assert.throws(john.set_note.bind(john, 1, note), 'We should not be able to set a item at a index which is out of bounds.');

      john.add_note(note);
      assert.equal(john.has_note(), true);
      assert.equal(john.note_size(), 1);
      assert.equal(john.note().length, 1);
      assert.equal(john.note().pop(), note, 'References should stay the same');
    });

    it('#compose', function() {
      serialized = john.compose();
    });
    it('#clear', function() {
      john.clear();

      assert.equal(john.has_name(), false);
      assert.equal(john.has_id(), false);
      assert.equal(john.has_address(), false);
    });
    it('default values', function() {
      
      assert.equal(john.name(), 'Unkown');
      assert.equal(john.id(), -1);
      assert.equal(typeof john.address(), 'undefined');
    });  

    it('#parse', function() {
      //console.log(JSON.stringify(serialized));
      john.parse(serialized);
      
      assert.equal(john.has_name(), true);
      assert.equal(john.has_id(), true);
      assert.equal(john.name(), 'John');
      assert.equal(john.id(), 1);

      var address2 = john.address();

      //console.log('address2(' + address2.compose + '): ' + require('util').inspect(address2));
      assert.equal(address2.has_country(), true);
      assert.equal(address2.has_city(), true);
      assert.equal(address2.country(), 'Sweden');
      assert.equal(address2.city(), 'Stockholm');

      assert.equal(john.has_note(), true);
      assert.equal(john.note_size(), 1);
      assert.equal(john.note().length, 1);
      
      //  These fields was never set
      assert.equal(address2.has_state(), false);
      assert.equal(address2.has_address(), false);
    });

    it('#validate', function() {

      john.validate(); // All required fields is set
      john.clear();
      assert.throws(john.validate.bind(john));
    });

    it('type enforcement', function() {
      assert.throws(john.set_name.bind(john, 1));
      assert.throws(john.set_id.bind(john, '1'));
    });


    it('multiple objects', function() {
      var anna = person();
      anna.set_name('anna');

      var address = address_info();

      address.set_country('England');
      address.set_city('London');
      anna.set_address(address);

      assert.equal(
        JSON.stringify(serialized).indexOf('_data'), -1,
        'Only objects data should be serialized, not the complete _data object.');
      
      john.parse(serialized);


      assert.equal(anna.has_name(), true);
      assert.equal(anna.has_id(), false);
      assert.equal(anna.name(), 'anna');

      address = anna.address();
      assert.equal(address.has_country(), true);
      assert.equal(address.has_city(), true);
      assert.equal(address.country(), 'England');
      assert.equal(address.city(), 'London');


      //  These fields was never set
      assert.equal(address.has_state(), false);
      assert.equal(address.has_address(), false);


      address = john.address();

      assert.equal(address.has_country(), true);
      assert.equal(address.has_city(), true);
      assert.equal(address.country(), 'Sweden');
      assert.equal(address.city(), 'Stockholm');

      //  These fields was never set
      assert.equal(address.has_state(), false);
      assert.equal(address.has_address(), false);
    });
    
    it('#clone', function() {
      var clone = john.clone();

      assert.equal(clone.has_name(), john.has_name());
      assert.equal(clone.has_id(), john.has_id());
      assert.equal(clone.has_address(), john.has_address());

      
      assert.equal(clone.name(), john.name());
      assert.equal(clone.id(), john.id());

      var address1 = clone.address(),
          address2 = john.address();

      [
        'country',
        'city',
        'state',
        'address'
      ].forEach(function(method) {
        assert.equal(address1['has_' + method](), address2['has_' + method]());
        assert.equal(address1[method](), address2[method]());
      });
      assert.equal(address1.zip().data(), address2.zip().data());
      assert.equal(clone.equals(john), true);
    });
  });

  describe('basic reflection', function() {

  });

});