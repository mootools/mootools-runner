/*

Adapter for the ES5Harness (see ../../1.4base/Types/fixtures/Function.js)

*/

(function(){
	
var specs = [];

ES5Harness = {
	
	registerTest: function(options){
		specs.push(options);
	},
	
	run: function(){
		describe('ES5Harness', function(){
			for (var spec, i = 0, l = specs.length; i < l; i++){
				spec = specs[i];
				it(spec.description || '', function(){
					expect(spec.test()).toBe(true);
				});
			}
		});
	}
	
};

})();