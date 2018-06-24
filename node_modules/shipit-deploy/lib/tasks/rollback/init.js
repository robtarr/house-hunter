'use strict';

exports.__esModule = true;

var _shipitUtils = require('shipit-utils');

var _shipitUtils2 = _interopRequireDefault(_shipitUtils);

var _posix = require('path2/posix');

var _posix2 = _interopRequireDefault(_posix);

var _extendShipit = require('../../extendShipit');

var _extendShipit2 = _interopRequireDefault(_extendShipit);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

/**
 * Update task.
 * - Create and define release path.
 * - Remote copy project.
 */
exports.default = shipit => {
  _shipitUtils2.default.registerTask(shipit, 'rollback:init', _asyncToGenerator(function* () {
    (0, _extendShipit2.default)(shipit);

    shipit.log('Get current release dirname.');

    const currentRelease = yield shipit.getCurrentReleaseDirname();

    if (!currentRelease) {
      throw new Error('Cannot find current release dirname.');
    }

    shipit.log('Current release dirname : %s.', currentRelease);
    shipit.log('Getting dist releases.');

    const releases = yield shipit.getReleases();

    if (!releases) {
      throw new Error('Cannot read releases.');
    }

    shipit.log('Dist releases : %j.', releases);

    const currentReleaseIndex = releases.indexOf(currentRelease);
    const rollbackReleaseIndex = currentReleaseIndex + 1;

    /* eslint-disable no-param-reassign */
    shipit.releaseDirname = releases[rollbackReleaseIndex];

    // Save the previous release in case we need to delete it later
    shipit.prevReleaseDirname = releases[currentReleaseIndex];
    shipit.prevReleasePath = _posix2.default.join(shipit.releasesPath, shipit.prevReleaseDirname);

    shipit.log('Will rollback to %s.', shipit.releaseDirname);

    if (!shipit.releaseDirname) {
      throw new Error('Cannot rollback, release not found.');
    }

    shipit.releasePath = _posix2.default.join(shipit.releasesPath, shipit.releaseDirname);
    /* eslint-enable no-param-reassign */

    shipit.emit('rollback');
  }));
};