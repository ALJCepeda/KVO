function setupTests() {

describe("KVO", function() {
	xdescribe("KVO Conversion", function() {
		var kvo;

		beforeEach(function() {
			kvo = new KVO();
		});
		
		it("throw exception, missing getter", function() {
			var obj = {
				_firstname:"",
				set firstname (value) {
					var first = value.toLowerCase(value);
					first = first.charAt(0).toUpperCase() + first.slice(1);
					this._firstname = first;
				}
			};

			(function() { kvo.convert(obj, "firstname"); }).should.throw();
		});

		it("throw exception, missing setter", function() {
			var obj = {
				_firstname:"",
				get firstname () {
					return this._firstname;
				}
			};

			(function() { kvo.convert(obj, "firstname"); }).should.throw();
		});

		it("create property with default setters/getters", function() {
			var obj = {};

			kvo.convert(obj, "foo");

			obj.foo = "bar";

			(obj.foo).should.equal("bar");
			(obj._kvo.foo).should.equal("bar");
		});

		it("wrap around setter", function() {
			var obj = {
				_firstname:"",
				set firstname (value) {
					var first = value.toLowerCase(value);
					first = first.charAt(0).toUpperCase() + first.slice(1);
					this._firstname = first;
				},
				get firstname () {
					return this._firstname;
				}
			};

			obj.firstname = "ALFRED";
			(obj._firstname).should.equal("Alfred");

			kvo.convert(obj, "firstname");

			obj.firstname = "SHAWN";
			(obj._firstname).should.equal("Shawn");
		});

		it("wrap around setter", function() {
			var obj = {
				_firstname:"",
				set firstname (value) {
					var first = value.toLowerCase(value);
					first = first.charAt(0).toUpperCase() + first.slice(1);
					this._firstname = first;
				},
				get firstname () {
					return this._firstname;
				}
			};

			obj.firstname = "ALFRED";
			(obj.firstname).should.equal("Alfred");
			(obj._firstname).should.equal("Alfred");

			kvo.convert(obj, "firstname");

			obj.firstname = "SHAWN";
			(obj.firstname).should.equal("Shawn");
			(obj._firstname).should.equal("Shawn");
		});

		it("wrap around getter", function() {
			var obj = {
				_firstname:"",
				set firstname (value) {
					this._firstname = value;
				},
				get firstname () {
					var value = this._firstname;
					value = value.toLowerCase(value);
					value = value.charAt(0).toUpperCase() + value.slice(1);
					return value;
				}
			};

			obj.firstname = "ALFRED";
			(obj._firstname).should.equal("ALFRED");
			(obj.firstname).should.equal("Alfred");

			kvo.convert(obj, "firstname");

			obj.firstname = "SHAWN";
			(obj._firstname).should.equal("SHAWN");
			(obj.firstname).should.equal("Shawn");
		});
	});

	describe("Post Hooks", function() {
		var kvo;

		beforeEach(function() {
			kvo = new KVO();
		});

		it("notified of property being set", function() {
			var obj = { firstname:"" };
			kvo.convert(obj, "firstname");

			obj.on_didSet("firstname", function(value) {
				(value).should.equal("Alfred");
			});

			obj.firstname = "Alfred";
		});

		it("notifies property being set once the no more", function() {
			var obj = { firstname:"" };
			kvo.convert(obj, "firstname");

			obj.once_didSet("firstname", function(value) {
				(value).should.equal("Alfred");
			});

			obj.firstname = "Alfred";
			obj.firstname = "Shawn";
		});

		it("notified of property being get", function() {
			var obj = { firstname:"Alfred" };
			kvo.convert(obj, "firstname");

			obj.on_didGet("firstname", function(value) {
				(value).should.equal("Alfred");
			});

			var firstname = obj.firstname;
			(firstname).should.equal("Alfred");
		});

		it("notifies property being get once the no more", function() {
			var obj = { firstname:"Alfred" };
			kvo.convert(obj, "firstname");

			obj.once_didGet("firstname", function(value) {
				(value).should.equal("Alfred");
			});

			var firstname = obj.firstname;
			(firstname).should.equal("Alfred");

			obj.firstname = "Shawn";
			firstname = obj.firstname;
			(firstname).should.equal("Shawn");
		});
	});	
});

}