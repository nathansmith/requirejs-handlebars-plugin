define(function() {

	var buildMap = {};

	return {

		load: function(name, parentRequire, onload, config) {

			if (config.isBuild) {
				var fs = require.nodeRequire('fs');
				var fsPath = config.dirBaseUrl + '/' + name + '.html';
				buildMap[name] = fs.readFileSync(fsPath).toString();
				onload();
			} else {
				parentRequire(['text!' + name + '.html', 'handlebars'], function(raw, handlebars) {
					onload(handlebars.default.compile(raw));
				});
			}

		},

		write: function(pluginName, name, write) {

			var handlebars = require.nodeRequire('handlebars');
			var compiled = handlebars.precompile(buildMap[name]);

			write(
				'define("html!' + name + '", ["handlebars"], function(handlebars){ \n' +
					'return handlebars.default.template(' + compiled.toString() + ');\n' +
				'});\n'
			);

		}

	};
});
