# validate-glob-opts

[![NPM version](https://img.shields.io/npm/v/validate-glob-opts.svg)](https://www.npmjs.com/package/validate-glob-opts)
[![Build Status](https://travis-ci.org/shinnn/validate-glob-opts.svg?branch=master)](https://travis-ci.org/shinnn/validate-glob-opts)
[![Coverage Status](https://img.shields.io/coveralls/shinnn/validate-glob-opts.svg)](https://coveralls.io/r/shinnn/validate-glob-opts)

Validate [node-glob](https://github.com/isaacs/node-glob) options

```javascript
validateGlobOpts({
  sync: true,
  mark: '/',
  caches: {}
});
/* => [
  Error: `sync` option is deprecated and there’s no need to pass any values to that option, but true was provided.,
  TypeError: node-glob expected `mark` option to be a Boolean value, but got '/'.,
  Error: node-glob doesn't have `caches` option. Probably you meant `cache`.
] */
```

## Installation

[Use npm.](https://docs.npmjs.com/cli/install)

```
npm install validate-glob-opts
```

## API

```javascript
const validateGlobOpts = require('validate-glob-opts');
```

### validateGlobOpts(*obj*)

*obj*: `Object` ([`glob` options](https://github.com/isaacs/node-glob#options))  
Return: `Array` of errors

It strictly validates `glob` options, for example,

* It disallows the deprecated `sync` option to receive any values.
* It disallows String options e.g. `cwd` to receive non-string values.
* It disallows Boolean options e.g. `stat` to receive non-boolean values.
* It disallows Object options e.g. `symlinks` to receive non-object values.
* It invalidates probably typoed option names e.g. `symlink`.

Then, it returns the validation result as an array of error objects.

```javascript
const validateGlobOpts = require('validate-glob-opts');

const ok = {
  root: '/foo/bar/',
  nodir: true,
  ignore: ['path1', 'path2'],
  symlinks: {}
};

validateGlobOpts(ok); //=> []

const notOk = {
  root: Buffer.from('Hi'),
  nodir: NaN,
  ignore: ['path1', 1],
  symlink: {}
};

const results = validateGlobOpts(notOk);
results.length; //=> 4
results[0];
//=>  TypeError: node-glob expected `root` option to be a directory path (string), but got <Buffer 48 69>.
results[1];
//=> TypeError: node-glob expected `nodir` option to be a Boolean value, but got NaN.
results[2];
//=> TypeError: Expected every value in the `ignore` option to be a string, but the array includes a non-string value 1.
results[3];
//=> Error: node-glob doesn't have `symlink` option. Probably you meant `symlinks`.
```

## License

Copyright (c) 2017 [Shinnosuke Watanabe](https://github.com/shinnn)

Licensed under [the MIT License](./LICENSE).
