const cheerio = require('cheerio');
const request = require('request-promise');

const getHouseList = () => {
  const { maxPrice, bedrooms, bathrooms, city, state } = process.env;
  const URL = `https://www.trulia.com/for_sale/${city},${state}/${bedrooms}p_beds/${bathrooms}p_baths/0-${maxPrice}_price/`;

  const options = {
    uri: URL,
    transform: body => cheerio.load(body)
  };

  return request(options).then($ => {
    const homes = [];

    $('.cardContainer').map((i, el) => {
      const $el = $(el);

      if (
        $el
          .find('.cardFooter')
          .text()
          .toLowerCase() !== 'bellbrook, oh'
      )
        return;

      let status = $el.find('.tagsListContainer').text();
      if (status.toLowerCase() === 'new' || status === '') {
        status = 'active';
      }

      const address = $el.find('.addressDetail .mvn').text();
      const price = $el.find('.cardPrice').text();
      const link = `http://trulia.com${$el.find('.tileLink').attr('href')}`;

      homes.push({ status, address, price, link });
    });

    return homes;
  });
};

module.exports = getHouseList;
