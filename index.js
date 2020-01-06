const cheerio = require('cheerio');
const createElement = require('create-html-element');

const getTagString = (name, attributes = {}) => {
  const html = attributes.html || '';
  delete attributes.html;
  return createElement({ name, attributes, html });
};

module.exports = class MetataggerPlugin {
  constructor(options) {
    this.options = options;
  }

  addMetatag = (selector, tag, attributes, prepend = false) => {
    if (prepend) {
      this.$(selector).prepend(getTagString(tag, attributes));
    } else {
      this.$(selector).append(getTagString(tag, attributes));
    }
  };

  apply(compiler) {
    const { tags } = this.options;
    compiler.plugin('compilation', (compilation) => {
      compilation.plugin(
        'html-webpack-plugin-before-html-processing',
        (data) => {
          this.$ = cheerio.load(data.html);

          Object.keys(tags).forEach((selector) => {
            const prepend = /__prepend$/.test(selector);
            const tagTypes = tags[selector];

            selector = selector.replace(/__prepend$/, '');
            Object.keys(tagTypes).forEach((tag) => {
              tagTypes[tag].forEach((attrs) => {
                this.addMetatag(selector, tag, attrs, prepend);
              });
            });
          });

          data.html = this.$.html();
          return data;
        }
      );
    });
  }
};
