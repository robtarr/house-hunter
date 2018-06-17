const Slack = require('slack-client');
const _ = require('lodash');
const env = require('dotenv');

env.config();
const slack = new Slack.WebClient(process.env.slackToken);

module.exports = function send(msg) {
  const slackChannel = '#' + process.env.slackChannel.replace('#', '');
  slack.chat.postMessage(slackChannel, msg.text);
  console.log(msg.text);
};
