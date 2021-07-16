function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var HtmlWebpackPlugin = _interopDefault(require('html-webpack-plugin'));
var cheerio = _interopDefault(require('cheerio'));
var createElement = _interopDefault(require('create-html-element'));
var validateOptions = _interopDefault(require('schema-utils'));

// JSON schema used to validate tags options.
var tagsSchema = {
  type: 'object',
  patternProperties: {
    '.*': {
      type: 'object',
      patternProperties: {
        '.*': {
          type: 'array',
          items: {
            type: 'object',
            patternProperties: {
              '.*': {
                type: 'string'
              }
            }
          }
        }
      }
    }
  }
};
var optionsSchema = {
  type: 'object',
  properties: {
    pages: {
      type: 'array',
      items: {
        type: 'string',
        pattern: '\.html$' // eslint-disable-line no-useless-escape

      }
    },
    tags: tagsSchema
  },
  required: ['tags']
};

var getTagString = function (name, attr) {
  if ( attr === void 0 ) attr = {};

  var attributes = Object.assign({}, attr);
  var html = attributes.html || '';
  delete attributes.html;

  try {
    return createElement({
      name: name,
      attributes: attributes,
      html: html
    });
  } catch (e) {
    throw new Error(("Metatagger Plugin: Error creating '" + name + "' element with attributes: \n" + (JSON.stringify(attributes, null, 2))));
  }
};

var MetataggerPlugin = function MetataggerPlugin(options) {
  var this$1 = this;

  this.addMetatag = function (selector, tag, attributes, prepend) {
    if ( prepend === void 0 ) prepend = false;

    var parent = this$1.$(selector);

    if (parent.length === 0) {
      throw new Error(("Metatagger Plugin: Can't locate any elements with '" + selector + "' selector."));
    }

    if (parent.length > 1) {
      console.warn(("Metatagger Plugin: More than one element foound with '" + selector + "' selector."));
    }

    if (prepend) {
      parent.prepend(getTagString(tag, attributes));
    } else {
      parent.append(getTagString(tag, attributes));
    }
  };

  validateOptions(optionsSchema, options, 'MetataggerPlugin');
  this.options = options;
};

MetataggerPlugin.prototype.apply = function apply (compiler) {
    var this$1 = this;

  var ref = this.options;
    var tags = ref.tags;
    var pages = ref.pages;
  if (!tags) { return; }
  compiler.hooks.compilation.tap('MetataggerPlugin', function (compilation) {
    HtmlWebpackPlugin.getHooks(compilation).beforeEmit.tapAsync('MetataggerPlugin', function (data, cb) {
      var emittedPageName = data.plugin.childCompilationOutputName || data.outputName;
      console.log({
        childCompilationOutputName: data.plugin.childCompilationOutputName,
        outputName: data.outputName
      });
      if (pages && pages.indexOf(emittedPageName) < 0) { return cb(null, data); }

      try {
        this$1.$ = cheerio.load(data.html);
      } catch (e) {
        throw new Error('Metatagger Plugin: Error loading HTML:\n' + e);
      }

      Object.keys(tags).forEach(function (selector) {
        var prepend = /__prepend$/.test(selector);
        var tagTypes = tags[selector];
        selector = selector.replace(/__prepend$/, '');
        Object.keys(tagTypes).forEach(function (tag) {
          tagTypes[tag].forEach(function (attrs) {
            this$1.addMetatag(selector, tag, attrs, prepend);
          });
        });
      });

      try {
        data.html = this$1.$.html();
      } catch (e) {
        throw new Error('Metatagger Plugin: Error rendering HTML:\n' + e);
      }

      cb(null, data);
    });
  });
};

module.exports = MetataggerPlugin;
//# sourceMappingURL=index.js.map
