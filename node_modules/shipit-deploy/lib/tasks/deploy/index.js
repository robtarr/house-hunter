'use strict';

exports.__esModule = true;

var _shipitUtils = require('shipit-utils');

var _shipitUtils2 = _interopRequireDefault(_shipitUtils);

var _init = require('./init');

var _init2 = _interopRequireDefault(_init);

var _fetch = require('./fetch');

var _fetch2 = _interopRequireDefault(_fetch);

var _update = require('./update');

var _update2 = _interopRequireDefault(_update);

var _publish = require('./publish');

var _publish2 = _interopRequireDefault(_publish);

var _clean = require('./clean');

var _clean2 = _interopRequireDefault(_clean);

var _finish = require('./finish');

var _finish2 = _interopRequireDefault(_finish);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Deploy task.
 * - deploy:fetch
 * - deploy:update
 * - deploy:publish
 * - deploy:clean
 * - deploy:finish
 */

exports.default = shipit => {
  (0, _init2.default)(shipit);
  (0, _fetch2.default)(shipit);
  (0, _update2.default)(shipit);
  (0, _publish2.default)(shipit);
  (0, _clean2.default)(shipit);
  (0, _finish2.default)(shipit);

  _shipitUtils2.default.registerTask(shipit, 'deploy', ['deploy:init', 'deploy:fetch', 'deploy:update', 'deploy:publish', 'deploy:clean', 'deploy:finish']);
};