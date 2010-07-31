
(function(context){

var toString = Object.prototype.toString;
var isArray = Array.isArray || function(array){
	return toString.call(array) == '[object Array]';
};

var indexOf = function(array, item, from){
	var len = array.length;
	for (var i = (from < 0) ? Math.max(0, len + from) : from || 0; i < len; i++){
		if (array[i] === item) return i;
	}
	return -1;
};

var forEach = function(array, fn, bind){
	for (var i = 0, l = array.length; i < l; i++){
		if (i in array) fn.call(bind, array[i], i, array);
	}
};

// Uses String.parseQueryString from MooTools-More
// TODO Needs compat for other browsers
var parseQueryString = function(string){
	if (typeof string != 'string') return string;

	var vars = string.split(/[&;]/), res = {};
	if (vars.length) forEach(vars, function(val){
		var index = val.indexOf('='),
			keys = index < 0 ? [''] : val.substr(0, index).match(/[^\]\[]+/g),
			value = decodeURIComponent(val.substr(index + 1)),
			obj = res;
		forEach(keys, function(key, i){
			var current = obj[key];
			if(i < keys.length - 1)
				obj = obj[key] = current || {};
			else if(current && isArray(current))
				current.push(value);
			else
				obj[key] = current != null ? [current, value] : value;
		});
	});
	return res;
};

context.SpecLoader = function(config, queryString){
	
	// initialization
	options = parseQueryString(queryString);
	
	var preset;
	if (options.preset) preset = config.presets[options.preset];

	var setNames = [],
		sourceNames = [];

	
	// private methods	
	var getSets = function(){
		var requestedSets = [],
			sets = (preset ? preset : options).sets;
	
		forEach(sets && isArray(sets) ? sets : [sets], function(set){
			if (config.sets[set] && indexOf(requestedSets, set) == -1) requestedSets.push(set);
		});
	
		return requestedSets;			
	},
		
	getSource = function(){
		var requestedSource = [],
			source = (preset ? preset : options).source;
		
		forEach(source && isArray(source) ? source : [source], function(src){
			if (config.source[src] && indexOf(requestedSource, src) == -1) requestedSource.push(src);
		});
	
		return requestedSource;			
	},
	
	loadSets = function(){
		forEach(setNames, function(set){
			load(config.sets[set].files, config.sets[set].path);
		});
	},
		
	loadSource = function(){
		forEach(sourceNames, function(set){
			load(config.source[set].files, config.source[set].path);
		});
			
	}		

	// public methods
	
	return {

		run: function(){
			
			// Get the sets and source
			setNames = getSets();		
			sourceNames = getSource();
			
			// Load the sets and source
			loadSource();
			loadSets();
		},
		
		getSetNames: function(){
			return setNames;
		}
	};
	
};


})(typeof exports != 'undefined' ? exports : this);
