var Promise = require('bluebird');
var childProcess = require('child_process');
var _ = require('lodash');

module.exports = function remoteInteractive(shipit) {

  return _.assign(shipit, {

    /**
     * Run a command and be interactive remotely.
     *
     * @param {String} command
     * @param {Object} options
     * @param {Function} cb
     * @returns {ChildObject}
     */

    remoteInteractive: function remoteInteractive(server, command, options, cb) {

      // remoteInteractive(shipit, command, cb)
      if (_.isFunction(options)) {
        cb = options;
        options = undefined;
      }

      return new Promise(function (resolve, reject) {
        var cmd = 'ssh';
        var args = [
          server,
          '-t',
          command
        ];

        var child = childProcess.spawn(cmd, args, {
          stdio: 'inherit'
        }).on('close', function(code) {
          process.stdin.setRawMode(false);

          if ( code ) {
            return reject(code);
          }

          resolve({
            child: child,
            stdout: child.stdout,
            stderr: child.stderr
          });
        });

      }).nodeify(cb);
    }

  });

};
