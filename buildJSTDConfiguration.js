#!/usr/bin/env node
// Builds a jsTestDriver.conf for the specified Source/Sets

(function(){

var options = require('./Helpers/RunnerOptions').parseOptions(process.argv[2]);
if (!options) return;

var data = 'server: http://localhost:9876\n\n';
data += 'load:\n';
load = function(object, base){
	for (var j = 0; j < object.length; j++)
		data += '  - "../' + (base || '') + object[j] + '.js"\n';
};

require('./Helpers/Loader');

var Configuration = require('../Configuration').Configuration,
	Source = Configuration.source,
	Sets = Configuration.sets;

load([
	'Runner/Jasmine/jasmine',
	'Runner/JSTD-Adapter/src/JasmineAdapter',
	'Runner/Helpers/Syn',
	'Runner/Helpers/JSSpecToJasmine'
]);

loadLibrary(Source, options);
loadSpecs(Sets, options);

// TODO check why JSTD Coverage fails
if (options.coverage){
	data += 'plugin:\n';
	data += '  - name: "coverage"\n';
	data += '    jar: "JSTestDriver/plugins/coverage.jar"\n';
}

var fs = require('fs');
fs.writeFile('./jsTestDriver.conf', data);

})();