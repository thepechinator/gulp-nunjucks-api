# gulp-nunjucks-api

> Render [Nunjucks](https://mozilla.github.io/nunjucks/) templates with data,
custom filters, custom context functions and options for other Nunjucks API
features.

## Install

Install with [npm](https://npmjs.org/package/gulp-nunjucks-api)

```
npm install --save-dev gulp-nunjucks-api
```

## Example

```js
var gulp = require('gulp');
var nunjucksRender = require('gulp-nunjucks-api');

gulp.task('default', function () {
  return gulp.src('src/templates/*.html')
    .pipe(nunjucksRender({
		  src: 'src/templates',
      data: require('./global-data.json'),
      filters: require('./global-filters.js'),
      functions: require('./global-functions.js')
		}))
		.pipe(gulp.dest('dist'));
});
```

## Example with gulp data

```js
var gulp = require('gulp');
var nunjucksRender = require('gulp-nunjucks-api');
var data = require('gulp-data');

function getDataForFile(file){
  return {
    example: 'data loaded for ' + file.relative
  };
}

gulp.task('default', function () {
	return gulp.src('src/templates/*.html')
	  .pipe(data(getDataForFile))
		.pipe(nunjucksRender({
      src: 'src/templates/'
    }))
		.pipe(gulp.dest('dist'));
});
```


## API

### gulp-nunjucks-api(options)

Renders source templates using the given options to configure the Nunjucks API
with custom data, extensions, filters and contextual functions.

Same options as
[`nunjucks.configure()`](http://mozilla.github.io/nunjucks/api.html#configure):

- **watch** _(default: false)_ reload templates when they are changed.
- **express** an express app that nunjucks should install to.
- **autoescape** _(default: false)_ controls if output with dangerous
characters are escaped automatically. See
[Autoescaping](http://mozilla.github.io/nunjucks/api.html#autoescaping).
- **tags** _(default: see nunjucks syntax)_ defines the syntax for nunjucks
tags. See
[Customizing Syntax](http://mozilla.github.io/nunjucks/api.html#customizing-syntax).

With the following additional options:

- **extension** _(default: ".html")_ String. File extension to output. Pass 'inherit'
to use the extension of the input file.
- **src** _(default: undefined)_ String or Array. Search path(s) for
`nunjucks.configure()`.
- **data** _(default: {})_ Ojbect. Global data merged into the Nunjucks render
context.
- **errors** _(default: true)_ Boolean. Whether to emit errors to gulp or not.
Set to `false` to let the gulp task continue on errors. See also: the verbose
option.
- **extensions** _(default: {})_ Object. Global extensions added to the
Nunjucks environment. See
[Custom Tags](http://mozilla.github.io/nunjucks/api.html#custom-tags).
- **filters** _(default: {})_ Object. Global filter functions added to the
Nunjucks environment. See
[Custom Filters](http://mozilla.github.io/nunjucks/api.html#custom-filters).
- **functions** _(default: {})_ Object. Global functions merged into the
Nunjucks render context.
- **globals** _(default: undefined)_ Object. A single object which provides
`data`, `extensions`, `filters` and `functions` objects instead of setting
each of these options separately. The separate global options are merged into
this base object.
- **locals** _(default: undefined)_ Boolean or String. When `true`, enables
loading of local template context data and functions from files that match
the following default pattern: `"<filename>.+(js|json)"`. When a
[glob pattern](https://github.com/isaacs/node-glob#glob-primer)
string is given, the directory containing a given template will be searched
using the pattern. Data and functions from all matched files are merged into
the render context. Note that the token `<filename>` will be replaced with a
given template's file name including extension. Use the `<filename_noext>`
token instead in a custom pattern to target the file name without extension.
- **verbose** _(default: false)_ Boolean. When `true`, detailed operational
data is logged to the console.
- **env** _(default: null)_ A nunjucks environment. Pass this in if you want
to use your own. Any globals, filters, or extensions you define on it will
be found.

### Render with data example
```
nunjucksRender({
  data: {css_path: 'http://company.com/css/'}
});
```

For the following template
```
<link rel="stylesheet" href="{{ css_path }}test.css" />
```

Would render
```
<link rel="stylesheet" href="http://company.com/css/test.css" />
```

### Watch mode
Nunjucks' watch feature, which is normally enabled by default, is disabled by                                          
default for gulp. Pass `watch: true` to enable it:

```
nunjucksRender({
  src: './source',
  watch: true
});
```

## License

MIT © [Devoptix LLC](http://www.devoptix.com)

## Shout-outs

[Carlos G. Limardo](http://limardo.org) who wrote
[gulp-nunjucks-render](https://www.npmjs.com/package/gulp-nunjucks-render)
which I am forking in order to update Nunjucks and do other stuff.

[Sindre Sorhus](http://sindresorhus.com/) who wrote the original
[gulp-nunjucks](https://www.npmjs.org/package/gulp-nunjucks) for precompiling
Nunjucks templates.
