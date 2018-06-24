'use strict';

exports.__esModule = true;

var _shipitUtils = require('shipit-utils');

var _shipitUtils2 = _interopRequireDefault(_shipitUtils);

var _extendShipit = require('../../extendShipit');

var _extendShipit2 = _interopRequireDefault(_extendShipit);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Finish task.
 * - Emit an event "deployed".
 */

const finishTask = shipit => {
  _shipitUtils2.default.registerTask(shipit, 'deploy:finish', () => {
    (0, _extendShipit2.default)(shipit);
    shipit.emit('deployed');
  });
};

exports.default = finishTask;