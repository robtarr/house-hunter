'use strict';

exports.__esModule = true;

var _shipitUtils = require('shipit-utils');

var _shipitUtils2 = _interopRequireDefault(_shipitUtils);

var _extendShipit = require('../../extendShipit');

var _extendShipit2 = _interopRequireDefault(_extendShipit);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

/**
 * Update task.
 * - Emit an event "rollbacked".
 */
exports.default = shipit => {
  _shipitUtils2.default.registerTask(shipit, 'rollback:finish', _asyncToGenerator(function* () {
    (0, _extendShipit2.default)(shipit);

    if (shipit.config.deleteOnRollback) {
      if (!shipit.prevReleaseDirname || !shipit.prevReleasePath) {
        throw new Error("Can't find release to delete");
      }

      const command = `rm -rf ${shipit.prevReleasePath}`;
      yield shipit.remote(command);
    }

    shipit.emit('rollbacked');
  }));
};