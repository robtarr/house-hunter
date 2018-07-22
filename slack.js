const Slack = require('@slack/client');

const _ = require('lodash');
const env = require('dotenv');

env.config();
const slack = new Slack.WebClient(process.env.slackToken);

module.exports = function send(msg) {
  const slackChannel = '#' + process.env.slackChannel.replace('#', '');

  const slackMessage = { channel: slackChannel, text: msg.text, as_user: true };

  if (msg.image) {
    slackMessage.attachments = [{
      text: 'Check it out',
      image_url: msg.image
    }]
  }

  slack.chat
    .postMessage(slackMessage)
    .then(res => {
      console.info(`Message sent to at ${new Date(parseInt(res.ts, 10))}`);
      console.log(msg.text);
    })
    .catch(console.error);
};
