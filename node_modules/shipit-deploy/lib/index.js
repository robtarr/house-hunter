'use strict';

var _deploy = require('./tasks/deploy');

var _deploy2 = _interopRequireDefault(_deploy);

var _rollback = require('./tasks/rollback');

var _rollback2 = _interopRequireDefault(_rollback);

var _pending = require('./tasks/pending');

var _pending2 = _interopRequireDefault(_pending);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = shipit => {
  (0, _deploy2.default)(shipit);
  (0, _rollback2.default)(shipit);
  (0, _pending2.default)(shipit);
};