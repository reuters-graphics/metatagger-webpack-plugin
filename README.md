![](badge.svg)

# metatagger-webpack-plugin

Inject metatags (or any tag) into html-webpack-plugin output.

[![npm version](https://badge.fury.io/js/metatagger-webpack-plugin.svg)](https://badge.fury.io/js/metatagger-webpack-plugin) [![Reuters open source software](https://badgen.net/badge/Reuters/open%20source/?color=ff8000)](https://github.com/reuters-graphics/)

### Install

```bash
$ npm install metatagger-webpack-plugin

# w/ html-webpack-plugin@next
$ npm install metatagger-webpack-plugin@next
```

or

```bash
$ yarn add metatagger-webpack-plugin

# w/ html-webpack-plugin@next
$ yarn metatagger-webpack-plugin@next
```

### Use

```javascript
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MetataggerPlugin = require('metatagger-webpack-plugin');

const webpackConfig = {
  // ...
  plugins: [
    new HtmlWebpackPlugin(),
    // Add plugin AFTER html-webpack-plugin.
    new MetataggerPlugin({
      // Specify which pages emitted from html-webpack-plugin to inject
      // tags into. Not specifying will inject tags into all pages.
      pages: ['index.html']
      // tags will represent the metatags to inject into your page.
      tags: {
        // Each property under tags is a valid query selector.
        head: {
          // Each property under the selector is a valid tag name.
          // --> <meta/>
          meta: [
            // Each item in tag array is a tag created with the attributes
            // you specify and appended as a child of the selector.
            // --> <meta name='og:title' content='My page title'/>
            { name: 'og:title', content: 'My page title' },
            { name: 'twitter:title', content: 'My page title' }
          ],
          title: [
            // 'html' is a special attribute that will be injected *within*
            // the created tag.
            // --> <title>My page title</title>
            { html: 'My page title' }
          ]
        },
        // If you'd rather *prepend* the injected tag before other children
        // in the selector, add '__prepend' to the selector name.
        body__prepend: {
          h1: [
            { html: 'My headline!' }
          ],
        },
      },
    }),
  ],
}

```
