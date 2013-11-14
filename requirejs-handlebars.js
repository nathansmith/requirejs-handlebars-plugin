define(["handlebars"], function(handlebars) {

  var buildMap = {},
      templateExtension = ".html";

  return {

    // http://requirejs.org/docs/plugins.html#apiload
    load: function (name, parentRequire, onload, config) {

      // Get the template extension.
      var ext = (config.hbs && config.hbs.templateExtension ? config.hbs.templateExtension : templateExtension);

      if (config.isBuild) {
        // Use node.js file system module to load the template.
        // Sorry, no Rhino support.
        var fs = nodeRequire("fs");
        var fsPath = config.dirBaseUrl + "/" + name + ext;
        buildMap[name] = fs.readFileSync(fsPath).toString();
        onload();
      } else {
        // In browsers use the text-plugin to the load template. This way we
        // don't have to deal with ajax stuff
        parentRequire(["text!" + name + ext], function(raw) {
          // Just return the compiled template
          onload(handlebars.default.compile(raw));
        });
      }

    },

    // http://requirejs.org/docs/plugins.html#apiwrite
    write: function (pluginName, name, write) {

     var Handlebars = nodeRequire('handlebars');
      var compiled = Handlebars.precompile(buildMap[name]);
      // Write out precompiled version of the template function as AMD
      // definition.
      write(
        "define('html!" + name + "', ['handlebars.runtime'], function(handlebars){ \n" +
          "return handlebars.default.template(" + compiled.toString() + ");\n" +
        "});\n"
      );
    }

  };
});