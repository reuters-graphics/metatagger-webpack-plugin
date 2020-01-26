import AJV from 'ajv';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import cheerio from 'cheerio';
import createElement from 'create-html-element';
import tagOptionsSchema from './schema';

const ajv = new AJV();

const getTagString = (name, attr = {}) => {
  const attributes = Object.assign({}, attr);
  const html = attributes.html || '';
  delete attributes.html;
  try {
    return createElement({ name, attributes, html });
  } catch (e) {
    throw new Error(`Metatagger Plugin: Error creating '${name}' element with attributes: \n${JSON.stringify(attributes, null, 2)}`);
  }
};

export default class MetataggerPlugin {
  constructor(options) {
    this.options = options;

    if (!options.tags) {
      console.warn('Metatagger Plugin: No tags options provided');
      return;
    }

    const validTags = ajv.validate(tagOptionsSchema, options.tags);

    if (!validTags) {
      throw new Error('Metatagger Plugin: Tags options is invalid.');
    }
  }

  addMetatag = (selector, tag, attributes, prepend = false) => {
    const parent = this.$(selector);

    if (parent.length === 0) {
      throw new Error(`Metatagger Plugin: Can't locate any elements with '${selector}' selector.`);
    }

    if (parent.length > 1) {
      console.warn(`Metatagger Plugin: More than one element foound with '${selector}' selector.`);
    }

    if (prepend) {
      parent.prepend(getTagString(tag, attributes));
    } else {
      parent.append(getTagString(tag, attributes));
    }
  };

  apply(compiler) {
    const { tags } = this.options;

    if (!tags) return;

    compiler.hooks.compilation.tap('MetataggerPlugin', (compilation) => {
      HtmlWebpackPlugin.getHooks(compilation).beforeEmit.tapAsync(
        'MetataggerPlugin', // <-- Set a meaningful name here for stacktraces
        (data, cb) => {
          try {
            this.$ = cheerio.load(data.html);
          } catch (e) {
            throw new Error('Metatagger Plugin: Error loading HTML:\n' + e);
          }

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

          try {
            data.html = this.$.html();
          } catch (e) {
            throw new Error('Metatagger Plugin: Error rendering HTML:\n' + e);
          }
          cb(null, data);
        }
      );
    });
  }
};
