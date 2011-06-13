var options = require('./Helpers/RunnerOptions').parseOptions(process.argv[2]);
if (!options) return;

// Initialize
var loader = require('./Helpers/Loader');
var SpecLoader = loader.SpecLoader(require('../Configuration').Configuration, options);

SpecLoader.setEnvName('jstd');

var data = 'server: http://localhost:9876\n\n',
	sources = '',
	specs = '';

var loadSource = function(object, base){
	for (var j = 0; j < object.length; j++)
		sources += '  - "../' + (base || '') + object[j] + '.js"\n';
};

var loadSpec = function(object, base){
	for (var j = 0; j < object.length; j++)
		specs += '  - "../' + (base || '') + object[j] + '.js"\n';
};

loadSource([
	'Runner/Jasmine/jasmine',
	'Runner/JSTD-Adapter/src/JasmineAdapter',
	'Runner/Helpers/Syn',
	'Runner/Helpers/simulateEvent',
	'Runner/Helpers/JSSpecToJasmine',
	'Runner/Helpers/Sinon.JS/lib/sinon',
	'Runner/Helpers/Sinon.JS/lib/sinon/util/fake_xml_http_request',
	'Runner/Helpers/Sinon.JS/lib/sinon/util/xhr_ie'
]);

SpecLoader.setSourceLoader(loadSource).setSpecLoader(loadSpec).run();

data += 'load:\n' + sources + '\n';
data += 'test:\n' + specs + '\n';


// TODO check why JSTD Coverage fails
if (options.coverage){
	data += 'plugin:\n';
	data += '  - name: "coverage"\n';
	data += '    jar: "JSTestDriver/plugins/coverage.jar"\n';
}

var fs = require('fs');
fs.writeFile('./jsTestDriver.conf', data);