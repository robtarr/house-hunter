const cheerio = require('cheerio');
const request = require('request-promise');

const getHouseList = () => {
  const { maxPrice, bedrooms, bathrooms, city, state } = process.env;
  const URL = `https://www.dabr.com/search-results/?polygon=%2488b61b356bbb730eac748ca2972e6b56&polynames=Bellbrook&circle=&beds=${bedrooms}%2B&baths=${bathrooms}%2B&listPrice%5B%5D=&listPrice%5B%5D=${maxPrice}&schoolDistrict=&keyword=&size=&yearBuilt=&market=dabr&listingType=residential&sortField=listPrice&sortOrder=desc&searchResultsUrl=https%3A%2F%2Fwww.dabr.com%2Fsearch-results%2F&idxs_do=`;

  const options = {
    uri: URL,
    transform: body => cheerio.load(body)
  };

  return request(options).then($ => {
    const homes = [];

    $('[data-type="listing"]').map((i, el) => {
      const $el = $(el);

      let status = $el.find('.status .field-value').text();
      if (status.toLowerCase() === 'new' || status === '') {
        status = 'active';
      }

      const address = $el
        .find('.listing-title .address-line1')
        .text()
        .replace(/(.*) Drive$/, '$1 Dr');
      const price = $el.find('.listPrice .field-value').text();
      const link = $el.find('.listing-title a').attr('href');

      homes.push({ status, address, price, link });
    });

    return homes;
  });
};

module.exports = getHouseList;
