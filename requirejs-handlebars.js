define(["handlebars"], function(handlebars) {

  var buildMap = {};

  return {

    load: function (name, parentRequire, onload, config) {

      if (config.isBuild) {
        var fs = nodeRequire("fs");
        var fsPath = config.dirBaseUrl + "/" + name + '.html';
        buildMap[name] = fs.readFileSync(fsPath).toString();
        onload();
      } else {
        parentRequire(["text!" + name + ext], function(raw) {
          onload(handlebars.default.compile(raw));
        });
      }

    },

    write: function (pluginName, name, write) {

      var Handlebars = require.nodeRequire('handlebars');
      var compiled = Handlebars.precompile(buildMap[name]);

      write(
        "define('html!" + name + "', ['handlebars.runtime'], function(handlebars){ \n" +
        "return handlebars.default.template(" + compiled.toString() + ");\n" +
      "});\n"
      );
    }

  };
});
