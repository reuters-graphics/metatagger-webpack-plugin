const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const Plugin = require('../../dist');

module.exports = function() {
  return {
    entry: path.resolve(__dirname, 'index.js'),
    output: {
      path: path.resolve(__dirname, './dist'),
      filename: 'bundle.js',
    },
    plugins: [
      new HtmlWebpackPlugin(),
      new HtmlWebpackPlugin({ filename: 'page.html' }),
      new Plugin({
        pages: ['index.html'],
        tags: {
          head: {
            meta: [
              { name: 'og:title', content: 'My title' },
            ],
          },
          head__prepend: {
            title: [{ html: 'My prepended title' }],
          },
          body: {
            h1: [
              { html: 'My headline', class: 'my-class' },
            ],
            p: [
              { html: 'para 1' },
              { html: 'para 2' },
            ],
          },
        },
      }),
    ],
  };
};
