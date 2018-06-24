'use strict';

exports.__esModule = true;

var _shipitUtils = require('shipit-utils');

var _shipitUtils2 = _interopRequireDefault(_shipitUtils);

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

var _extendShipit = require('../../extendShipit');

var _extendShipit2 = _interopRequireDefault(_extendShipit);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

/**
 * Log task.
 */
const logTask = shipit => {
  _shipitUtils2.default.registerTask(shipit, 'pending:log', _asyncToGenerator(function* () {
    (0, _extendShipit2.default)(shipit);
    const commits = yield shipit.getPendingCommits();
    const msg = commits ? _chalk2.default.yellow(_chalk2.default.underline('\nPending commits:\n') + commits) : _chalk2.default.green('\nNo pending commits.');

    shipit.log(msg);
  }));
};

exports.default = logTask;