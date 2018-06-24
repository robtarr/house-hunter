require('dotenv').config();

module.exports = function(shipit) {
  require('shipit-deploy')(shipit);
  require('shipit-shared')(shipit);

  var deployPath = '/usr/src/house-hunter';

  shipit.initConfig({
    default: {
      workspace: '/tmp/house-hunter',
      deployTo: deployPath,
      repositoryUrl: 'git@github.com:robtarr/house-hunter.git',
      ignores: ['.git', 'node_modules'],
      keepReleases: 4,
      key: '/Users/Rob/.ssh/id_rsa',
      shallowClone: false,
      shared: {
        baseDir: 'shared',
        files: ['.env']
      }
    },
    production: {
      servers: `${process.env.deployUser}@${process.env.deployServer}`
    }
  });
};
