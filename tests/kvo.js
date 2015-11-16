function setupTests() {

describe("KVO", function() {
	describe("KVO Conversion", function() {
		var kvo = new KVO();

		it("should create property with default setters/getters", function() {
			var obj = {};

			kvo.convert(obj, "foo");

			obj.foo = "bar";

			(obj.foo).should.equal("bar");
			(obj._kvo.foo).should.equal("bar");
		});

		it("should overwrite setter", function() {
			var obj = {
				_firstname:"",
				set firstname (value) {
					var first = value.toLowerCase(value);
					first = first.charAt(0).toUpperCase() + first.slice(1);
					this._firstname = first;
				}
			};

			obj.firstname = "ALFRED";
			(obj._firstname).should.equal("Alfred");

			kvo.convert(obj, "firstname");

			obj.firstname = "SHAWN";
			(obj._firstname).should.equal("Shawn");
		});
	});
});

}