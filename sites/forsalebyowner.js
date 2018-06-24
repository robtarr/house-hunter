const cheerio = require('cheerio');
const request = require('request-promise');

const getHouseList = () => {
  const { maxPrice, bedrooms, bathrooms, city, state } = process.env;
  const URL = `https://www.forsalebyowner.com/search/list/${city}%2C%20${state}/${bedrooms}-beds/${bathrooms}-baths/:${maxPrice}-price/1-page/proximity,desc-sort`;

  const options = {
    uri: URL,
    transform: body => cheerio.load(body)
  };

  return request(options).then($ => {
    const homes = [];
    const addressTest = new RegExp(`\s*(.*),.*\n.*${city}`);

    $('.estate').map((i, el) => {
      const $el = $(el);

      const fullAddress = $el.find('.estateSummary-address').text();
      const addressMatches = fullAddress.match(addressTest);

      if (!addressMatches) return;

      const status = 'active';
      const address = addressMatches[1];
      const price = $el.find('.estateSummary-price').text();
      const link = $el
        .find('a')
        .first()
        .attr('href');

      homes.push({ status, address, price, link });
    });

    return homes;
  });
};

module.exports = getHouseList;
