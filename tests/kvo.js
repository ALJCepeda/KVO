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
	});
});

}