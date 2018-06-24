'use strict';

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _posix = require('path2/posix');

var _posix2 = _interopRequireDefault(_posix);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _util = require('util');

var _util2 = _interopRequireDefault(_util);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

/**
 * Compute the current release dir name.
 *
 * @param {object} result
 * @returns {string}
 */
function computeReleases(result) {
  if (!result.stdout) return null;

  // Trim last breakline.
  const dirs = result.stdout.replace(/\n$/, '');

  // Convert releases to an array.
  return dirs.split('\n');
}

/**
 * Test if all values are equal.
 *
 * @param {*[]} values
 * @returns {boolean}
 */
function equalValues(values) {
  return values.every(value => _lodash2.default.isEqual(value, values[0]));
}

/**
 * Compute the current release dir name.
 *
 * @param {object} result
 * @returns {string}
 */
function computeReleaseDirname(result) {
  if (!result.stdout) return null;

  // Trim last breakline.
  const target = result.stdout.replace(/\n$/, '');
  return target.split(_posix2.default.sep).pop();
}

function extendShipit(shipit) {
  /* eslint-disable no-param-reassign */
  shipit.currentPath = _posix2.default.join(shipit.config.deployTo, 'current');
  shipit.releasesPath = _posix2.default.join(shipit.config.deployTo, 'releases');
  const config = _extends({
    branch: 'master',
    keepReleases: 5,
    shallowClone: true,
    gitLogFormat: '%h: %s - %an'
  }, shipit.config);
  Object.assign(shipit.config, config);
  /* eslint-enable no-param-reassign */

  const Shipit = shipit.constructor;

  /**
   * Return the current release dirname.
   */
  Shipit.prototype.getCurrentReleaseDirname = (() => {
    var _ref = _asyncToGenerator(function* () {
      const results = (yield this.remote(_util2.default.format('if [ -h %s ]; then readlink %s; fi', this.currentPath, this.currentPath))) || [];

      const releaseDirnames = results.map(computeReleaseDirname);

      if (!equalValues(releaseDirnames)) {
        throw new Error('Remote servers are not synced.');
      }

      if (!releaseDirnames[0]) {
        this.log('No current release found.');
        return null;
      }

      return releaseDirnames[0];
    });

    function getCurrentReleaseDirname() {
      return _ref.apply(this, arguments);
    }

    return getCurrentReleaseDirname;
  })();

  /**
   * Return all remote releases (newest first)
   */
  Shipit.prototype.getReleases = (() => {
    var _ref2 = _asyncToGenerator(function* () {
      const results = yield this.remote(`ls -r1 ${this.releasesPath}`);
      const releases = results.map(computeReleases);

      if (!equalValues(releases)) {
        throw new Error('Remote servers are not synced.');
      }

      return releases[0];
    });

    function getReleases() {
      return _ref2.apply(this, arguments);
    }

    return getReleases;
  })();

  /**
   * Return SHA from remote REVISION file.
   *
   * @param {string} releaseDir Directory name of the relesase dir (YYYYMMDDHHmmss).
   */
  Shipit.prototype.getRevision = (() => {
    var _ref3 = _asyncToGenerator(function* (releaseDir) {
      const file = _posix2.default.join(this.releasesPath, releaseDir, 'REVISION');
      const response = yield this.remote(`if [ -f ${file} ]; then cat ${file} 2>/dev/null; fi;`);
      return response[0].stdout.trim();
    });

    function getRevision(_x) {
      return _ref3.apply(this, arguments);
    }

    return getRevision;
  })();

  Shipit.prototype.getPendingCommits = (() => {
    var _ref4 = _asyncToGenerator(function* () {
      const currentReleaseDirname = yield this.getCurrentReleaseDirname();
      if (!currentReleaseDirname) return null;

      const deployedRevision = yield this.getRevision(currentReleaseDirname);
      if (!deployedRevision) return null;

      const res = yield this.local('git remote', { cwd: this.config.workspace });
      const remotes = res && res.stdout ? res.stdout.split(/\s/) : [];
      if (remotes.length < 1) return null;

      // Compare against currently undeployed revision
      const compareRevision = `${remotes[0]}/${this.config.branch}`;

      const response = yield this.local(`git log --pretty=format:"${shipit.config.gitLogFormat}" ${deployedRevision}..${compareRevision}`, { cwd: shipit.workspace });
      const commits = response.stdout.trim();
      return commits || null;
    });

    function getPendingCommits() {
      return _ref4.apply(this, arguments);
    }

    return getPendingCommits;
  })();
}

exports.default = extendShipit;