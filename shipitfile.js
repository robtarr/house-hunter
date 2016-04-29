module.exports = function(shipit) {
  require('shipit-deploy')(shipit);

  var deployPath = '/usr/src/house-hunter';

  shipit.initConfig({
    default: {
      workspace: '/tmp/house-hunter',
      deployTo: deployPath,
      repositoryUrl: 'git@github.com:robtarr/house-hunter.git',
      ignores: ['.git', 'node_modules'],
      // rsync: ['--del'],
      keepReleases: 2,
      key: '/Users/Rob/.ssh/id_rsa',
      shallowClone: false,
    },
    production: {
      servers: '159.203.92.26'
    }
  });

  shipit.on('deployed', function() {
    return shipit.remote('cd ' + deployPath + '/current' + ' && npm install');
  });
};
