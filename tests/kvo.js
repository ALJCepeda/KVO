function setupTests() {

describe("KVO", function() {
	describe("KVO Conversion", function() {
		

		it("should create property with default setters/getters", function() {
			var kvo = new KVO();
			var obj = {};

			kvo.convert(obj, "foo");

			obj.foo = "bar";

			(obj.foo).should.equal("bar");

			var ID = obj._kvoID;
			var foo = kvo.get(ID, "foo");
			(foo).should.equal("bar");
		});

		it("should overwrite setter", function() {
			var kvo = new KVO();
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