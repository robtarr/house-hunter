'use strict';

exports.__esModule = true;

var _shipitUtils = require('shipit-utils');

var _shipitUtils2 = _interopRequireDefault(_shipitUtils);

var _init = require('./init');

var _init2 = _interopRequireDefault(_init);

var _fetch = require('../deploy/fetch');

var _fetch2 = _interopRequireDefault(_fetch);

var _clean = require('../deploy/clean');

var _clean2 = _interopRequireDefault(_clean);

var _finish = require('./finish');

var _finish2 = _interopRequireDefault(_finish);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Rollback task.
 * - rollback:init
 * - deploy:publish
 * - deploy:clean
 */
exports.default = shipit => {
  (0, _init2.default)(shipit);
  (0, _fetch2.default)(shipit);
  (0, _clean2.default)(shipit);
  (0, _finish2.default)(shipit);

  _shipitUtils2.default.registerTask(shipit, 'rollback', ['rollback:init', 'deploy:publish', 'deploy:clean', 'rollback:finish']);
};