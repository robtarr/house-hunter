const cheerio = require('cheerio');
const request = require('request-promise');

const getHouseList = () => {
  const { maxPrice, bedrooms, bathrooms, city, state, sqft } = process.env;

  const URL = `https://www.realtor.com/realestateandhomes-search/${city}_${state}/beds-${bedrooms}/baths-${bathrooms}/price-na-${maxPrice}/sqft-${sqft}`;
  const options = {
    uri: URL,
    transform: body => cheerio.load(body)
  };

  return request(options).then($ => {
    const homes = [];

    $('.js-record-user-activity').map((i, el) => {
      const $el = $(el);

      let status = $el.find('.label-wrapper').text();
      if (status.toLowerCase() === 'new' || status === '') {
        status = 'active';
      }

      const address = $el.find('.listing-street-address').text();
      const price = $el.find('.data-price-display').text();
      const link = `http://realtor.com/realestateandhomes-detail${
        $el.data().url
      }`;
      const image = $el.find('img').attr('src');

      homes.push({ status, address, price, link, image });
    });

    return homes;
  });
};

module.exports = getHouseList;
