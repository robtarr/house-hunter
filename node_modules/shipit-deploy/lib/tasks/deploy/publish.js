'use strict';

exports.__esModule = true;

var _shipitUtils = require('shipit-utils');

var _shipitUtils2 = _interopRequireDefault(_shipitUtils);

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

var _posix = require('path2/posix');

var _posix2 = _interopRequireDefault(_posix);

var _extendShipit = require('../../extendShipit');

var _extendShipit2 = _interopRequireDefault(_extendShipit);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

/**
 * Publish task.
 * - Update symbolic link.
 */
const publishTask = shipit => {
  _shipitUtils2.default.registerTask(shipit, 'deploy:publish', _asyncToGenerator(function* () {
    (0, _extendShipit2.default)(shipit);

    shipit.log('Publishing release "%s"', shipit.releasePath);

    const relativeReleasePath = _posix2.default.join('releases', shipit.releaseDirname);

    /* eslint-disable prefer-template */
    const res = yield shipit.remote('cd ' + shipit.config.deployTo + ' && ' + 'if [ -d current ] && [ ! -L current ]; then ' + 'echo "ERR: could not make symlink"; ' + 'else ' + 'ln -nfs ' + relativeReleasePath + ' current_tmp && ' + 'mv -fT current_tmp current; ' + 'fi');
    /* eslint-enable prefer-template */

    const failedresult = res && res.stdout ? res.stdout.filter(function (r) {
      return r.indexOf('could not make symlink') > -1;
    }) : [];
    if (failedresult.length && failedresult.length > 0) {
      shipit.log(_chalk2.default.yellow(`Symbolic link at remote not made, as something already exists at ${(0, _posix2.default)(shipit.config.deployTo, 'current')}`));
    }

    shipit.log(_chalk2.default.green('Release published.'));

    shipit.emit('published');
  }));
};

exports.default = publishTask;