'use strict';

const fs = require('fs');
const cheerio = require('cheerio');
const request = require('request-promise');
const _ = require('lodash');
const chalk = require('chalk');
const slack = require('./slack');
const realtor = require('./sites/realtor');
const trulia = require('./sites/trulia');
const dabr = require('./sites/dabr');
const dabrRealtor = require('./sites/dabr-realtor');
const forsalebyowner = require('./sites/forsalebyowner');

process.on('unhandledRejection', (reason, p) => {
  console.log('Unhandled Rejection at: Promise', p, 'reason:', reason);
});

function loadLastList() {
  const data = fs.readFileSync('activeHomes.json', 'utf8') || '[]';

  return JSON.parse(data);
}

function saveActive(list) {
  fs.writeFileSync('activeHomes.json', JSON.stringify(list));
}

function compare(oldList, newList) {
  return _.differenceBy(newList, oldList, 'address');
}

function slackIt(newHomes) {
  newHomes.forEach(home => {
    slack({
      text: `${home.address} for ${home.price} -> ${home.link}`,
      image: home.image
    });
  });
}

function getHomes() {
  const lastActive = loadLastList();

  Promise.all([realtor(), dabrRealtor(), dabr(), trulia(), forsalebyowner()]).then(homes => {
    const allHomes = _.flatten(homes);
    const uniqHomes = [];

    allHomes.forEach(house => {
      if (_.findIndex(uniqHomes, { address: house.address }) < 0) {
        uniqHomes.push(house);
      }
    });

    const active = uniqHomes.filter(function(house) {
      return house.status.toLowerCase() === 'active';
    });

    const newHomes = compare(lastActive, active);
    slackIt(newHomes);
    saveActive(active);
  });
}

getHomes();
