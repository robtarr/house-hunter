/*!
 * assert-valid-glob-opts | MIT (c) Shinnosuke Watanabe
 * https://github.com/shinnn/assert-valid-glob-opts
*/
'use strict';

const validateGlobOpts = require('validate-glob-opts');

function isTypeError(err) {
  return err.name === 'TypeError';
}

function createMessageLine(msg, err, index) {
  return `${msg}\n  ${index + 1}. ${err.message}`;
}

module.exports = function assertValidGlobOpts(obj) {
  const results = validateGlobOpts(obj);
  const count = results.length;

  if (count === 0) {
    return;
  }

  if (count === 1) {
    throw results[0];
  }

  throw new (results.every(isTypeError) ? TypeError : Error)(results.reduce(
    createMessageLine,
    `${count} errors found in the node-glob options:`
  ));
};
