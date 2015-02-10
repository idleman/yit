var assert = require("assert"),
		yit = require(__dirname + '/../../index');

describe('compatibility', function() {
	var person_v1 = null,
      person_v2 = null;

  describe('schema', function() {
    it('loading version 1', function() {
      var source = require('./schema-v1.js'),
          scope = yit.parse(source);

      person_v1 = scope.person;
    });
    it('loading version 2', function() {
      var source = require('./schema-v2.js'),
          scope = yit.parse(source);

      person_v2 = scope.person;
    });
    //console.log('returned scope from yit: ' + require('util').inspect(scope));    
  })
  describe('usage', function() {
    var serialized = null,
        john = null;


    it('version 1 => version 2', function() {
      var john = person_v1();
      john.set_name('John');
      serialized = john.compose();
      john.clear();

      var obj = person_v2();
      obj.parse(serialized);
      assert.equal(obj.has_name(), true);
      assert.equal(obj.name(),'John');
      assert.equal(obj.has_email(), false);
    });
    
    it('version 2 => version 1', function() {
      var john = person_v2();
      john.set_name('John');
      john.set_email('John');

      serialized = john.compose();
      john.clear();

      var obj = person_v1();
      obj.parse(serialized);
      assert.equal(obj.has_name(), true);
      assert.equal(obj.name(),'John');
    });
  });
});