const cheerio = require('cheerio');
const request = require('request-promise');

const getHouseList = () => {
  const { maxPrice, bedrooms, bathrooms, city, state } = process.env;
  const URL = process.env.DABR_PROBST_URL;
  const options = {
    uri: URL,
    transform: body => cheerio.load(body)
  };

  return request(options).then($ => {
    const homes = [];

    $('.multiLineDisplay').map((i, el) => {
      const $el = $(el);

      let status = $el.find('.Status_A').text();
      if (status.toLowerCase() === 'new' || status === '') {
        status = 'active';
      }

      const address = $el
        .find('.J_formula')
        .eq(2)
        .text()
        .replace(/(.*) Drive$/, '$1 Dr')
        .replace(/(.*) Place$/, '$1 Pl')
        .replace(/(.*) Road$/, '$1 Rd')
        .replace(/(.*) Lane$/, '$1 Ln')
        .replace(/(.*) Court$/, '$1 Ct');
      const price = $el.find('.d-fontSize--largest').text();

      homes.push({ status, address, price, link: URL });      
    });

    return homes;
  });
};

module.exports = getHouseList;
