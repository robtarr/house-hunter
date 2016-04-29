'use strict';

const fs = require('fs');
const cheerio = require('cheerio');
const request = require('request-promise');
const _ = require('lodash');
const chalk = require('chalk');
const slack = require('./slack');

let homes = [];

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

function getHouseList() {
  let options = {
    uri: process.env.MLS_URL,
    transform: (body) => {
      return cheerio.load(body);
    }
  };

  return request(options).then(function($) {

    $('.singleLineDisplay').each(function(i, e) {
      const status = $(this).find('.d5m13').text(),
            address = $(this).find('.d5m14').text(),
            price = $(this).find('.d5m21').text();

      homes.push({
        status,
        address,
        price,
      });
    });
  });
}

function slackIt(newHomes) {
  newHomes.forEach((home) => {
    slack({
      text: `<!channel> ${home.address} for${home.price}. ${process.env.MLS_URL}`
    });
  });
}

function getHomes() {
  const lastActive = loadLastList();

  getHouseList().then(function() {
    const active = homes.filter(function(house) {
      return house.status === 'Active';
    });

    const newHomes = compare(lastActive, active);
    slackIt(newHomes);
    saveActive(active);
  });
}

getHomes();
