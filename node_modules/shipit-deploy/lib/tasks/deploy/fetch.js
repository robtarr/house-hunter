'use strict';

exports.__esModule = true;

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _shipitUtils = require('shipit-utils');

var _shipitUtils2 = _interopRequireDefault(_shipitUtils);

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

var _tmpPromise = require('tmp-promise');

var _tmpPromise2 = _interopRequireDefault(_tmpPromise);

var _extendShipit = require('../../extendShipit');

var _extendShipit2 = _interopRequireDefault(_extendShipit);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

/**
 * Fetch task.
 * - Create workspace.
 * - Fetch repository.
 * - Checkout commit-ish.
 */
const fetchTask = shipit => {
  _shipitUtils2.default.registerTask(shipit, 'deploy:fetch', _asyncToGenerator(function* () {

    /**
     * Create workspace.
     */
    let createWorkspace = (() => {
      var _ref2 = _asyncToGenerator(function* () {
        let create = (() => {
          var _ref3 = _asyncToGenerator(function* () {
            shipit.log('Create workspace...');
            /* eslint-disable no-param-reassign */
            if (shipit.config.shallowClone) {
              const tmpDir = yield _tmpPromise2.default.dir();
              shipit.workspace = tmpDir.path;
            } else {
              shipit.workspace = shipit.config.workspace;
              if (_path2.default.resolve(shipit.workspace) === process.cwd()) {
                throw new Error('Workspace should be a temporary directory');
              }
            }
            /* eslint-enable no-param-reassign */
            shipit.log(_chalk2.default.green(`Workspace created: "${shipit.workspace}"`));
          });

          return function create() {
            return _ref3.apply(this, arguments);
          };
        })();

        return create();
      });

      return function createWorkspace() {
        return _ref2.apply(this, arguments);
      };
    })();

    /**
     * Initialize repository.
     */


    let initRepository = (() => {
      var _ref4 = _asyncToGenerator(function* () {
        shipit.log('Initialize local repository in "%s"', shipit.workspace);
        yield shipit.local('git init', { cwd: shipit.workspace });
        shipit.log(_chalk2.default.green('Repository initialized.'));
      });

      return function initRepository() {
        return _ref4.apply(this, arguments);
      };
    })();

    /**
     * Set git config.
     */


    let setGitConfig = (() => {
      var _ref5 = _asyncToGenerator(function* () {
        if (!shipit.config.gitConfig) return;

        shipit.log('Set custom git config options for "%s"', shipit.workspace);

        yield Promise.all(Object.keys(shipit.config.gitConfig || {}).map(function (key) {
          return shipit.local(`git config ${key} "${shipit.config.gitConfig[key]}"`, {
            cwd: shipit.workspace
          });
        }));
        shipit.log(_chalk2.default.green('Git config set.'));
      });

      return function setGitConfig() {
        return _ref5.apply(this, arguments);
      };
    })();

    /**
     * Add remote.
     */


    let addRemote = (() => {
      var _ref6 = _asyncToGenerator(function* () {
        shipit.log('List local remotes.');

        const res = yield shipit.local('git remote', {
          cwd: shipit.workspace
        });

        const remotes = res.stdout ? res.stdout.split(/\s/) : [];
        const method = remotes.indexOf('shipit') !== -1 ? 'set-url' : 'add';

        shipit.log('Update remote "%s" to local repository "%s"', shipit.config.repositoryUrl, shipit.workspace);

        // Update remote.
        yield shipit.local(`git remote ${method} shipit ${shipit.config.repositoryUrl}`, { cwd: shipit.workspace });

        shipit.log(_chalk2.default.green('Remote updated.'));
      });

      return function addRemote() {
        return _ref6.apply(this, arguments);
      };
    })();

    /**
     * Fetch repository.
     */


    let fetch = (() => {
      var _ref7 = _asyncToGenerator(function* () {
        let fetchCommand = 'git fetch shipit --prune';
        const fetchDepth = shipit.config.shallowClone ? ' --depth=1' : '';

        // fetch branches and tags separate to be compatible with git versions < 1.9
        fetchCommand += `${fetchDepth} && ${fetchCommand} "refs/tags/*:refs/tags/*"`;

        shipit.log('Fetching repository "%s"', shipit.config.repositoryUrl);

        yield shipit.local(fetchCommand, { cwd: shipit.workspace });
        shipit.log(_chalk2.default.green('Repository fetched.'));
      });

      return function fetch() {
        return _ref7.apply(this, arguments);
      };
    })();

    /**
     * Checkout commit-ish.
     */


    let checkout = (() => {
      var _ref8 = _asyncToGenerator(function* () {
        shipit.log('Checking out commit-ish "%s"', shipit.config.branch);
        yield shipit.local(`git checkout ${shipit.config.branch}`, {
          cwd: shipit.workspace
        });
        shipit.log(_chalk2.default.green('Checked out.'));
      });

      return function checkout() {
        return _ref8.apply(this, arguments);
      };
    })();

    /**
     * Hard reset of working tree.
     */


    let reset = (() => {
      var _ref9 = _asyncToGenerator(function* () {
        shipit.log('Resetting the working tree');
        yield shipit.local('git reset --hard HEAD', {
          cwd: shipit.workspace
        });
        shipit.log(_chalk2.default.green('Reset working tree.'));
      });

      return function reset() {
        return _ref9.apply(this, arguments);
      };
    })();

    /**
     * Merge branch.
     */


    let merge = (() => {
      var _ref10 = _asyncToGenerator(function* () {
        shipit.log('Testing if commit-ish is a branch.');

        const res = yield shipit.local(`git branch --list ${shipit.config.branch}`, {
          cwd: shipit.workspace
        });

        const isBranch = !!res.stdout;

        if (!isBranch) {
          shipit.log(_chalk2.default.green('No branch, no merge.'));
          return;
        }

        shipit.log('Commit-ish is a branch, merging...');

        // Merge branch.
        yield shipit.local(`git merge shipit/${shipit.config.branch}`, {
          cwd: shipit.workspace
        });

        shipit.log(_chalk2.default.green('Branch merged.'));
      });

      return function merge() {
        return _ref10.apply(this, arguments);
      };
    })();

    /**
     * update submodules
     */


    let updateSubmodules = (() => {
      var _ref11 = _asyncToGenerator(function* () {
        if (!shipit.config.updateSubmodules) return;

        shipit.log('Updating submodules.');
        yield shipit.local('git submodule update --init --recursive', {
          cwd: shipit.workspace
        });
        shipit.log(_chalk2.default.green('Submodules updated'));
      });

      return function updateSubmodules() {
        return _ref11.apply(this, arguments);
      };
    })();

    (0, _extendShipit2.default)(shipit);

    yield createWorkspace();
    yield initRepository();
    yield setGitConfig();
    yield addRemote();
    yield fetch();
    yield checkout();
    yield reset();
    yield merge();
    yield updateSubmodules();
    shipit.emit('fetched');
  }));
};

exports.default = fetchTask;