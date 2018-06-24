'use strict';

exports.__esModule = true;

var _shipitUtils = require('shipit-utils');

var _shipitUtils2 = _interopRequireDefault(_shipitUtils);

var _extendShipit = require('../../extendShipit');

var _extendShipit2 = _interopRequireDefault(_extendShipit);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Init task.
 * - Emit deploy event.
 */
const initTask = shipit => {
  _shipitUtils2.default.registerTask(shipit, 'deploy:init', () => {
    (0, _extendShipit2.default)(shipit);
    shipit.emit('deploy');
  });
};

exports.default = initTask;