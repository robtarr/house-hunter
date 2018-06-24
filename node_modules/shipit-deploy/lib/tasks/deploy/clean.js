'use strict';

exports.__esModule = true;

var _shipitUtils = require('shipit-utils');

var _shipitUtils2 = _interopRequireDefault(_shipitUtils);

var _extendShipit = require('../../extendShipit');

var _extendShipit2 = _interopRequireDefault(_extendShipit);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; } /* eslint-disable prefer-template */


/**
 * Clean task.
 * - Remove old releases.
 */
const cleanTask = shipit => {
  _shipitUtils2.default.registerTask(shipit, 'deploy:clean', _asyncToGenerator(function* () {
    (0, _extendShipit2.default)(shipit);

    shipit.log('Keeping "%d" last releases, cleaning others', shipit.config.keepReleases);

    const command = '(ls -rd ' + shipit.releasesPath + '/*|head -n ' + shipit.config.keepReleases + ';ls -d ' + shipit.releasesPath + '/*)|sort|uniq -u|xargs rm -rf';
    yield shipit.remote(command);

    shipit.emit('cleaned');
  }));
};

exports.default = cleanTask;