'use strict';

exports.__esModule = true;

var _shipitUtils = require('shipit-utils');

var _shipitUtils2 = _interopRequireDefault(_shipitUtils);

var _log = require('./log');

var _log2 = _interopRequireDefault(_log);

var _fetch = require('../deploy/fetch');

var _fetch2 = _interopRequireDefault(_fetch);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Pending task.
 * - deploy:fetch
 * - pending:log
 */
exports.default = shipit => {
  (0, _log2.default)(shipit);
  (0, _fetch2.default)(shipit);
  _shipitUtils2.default.registerTask(shipit, 'pending', ['deploy:fetch', 'pending:log']);
};