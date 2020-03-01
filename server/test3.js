var axios = require('axios');
var cheerio = require('cheerio');


async function scrapeRealtor() {
  const html = await axios.get('https://guide.michelin.com/fr/fr/restaurants/bib-gourmand/page/1');
  const $ = await cheerio.load(html.data);
  let data = [];

  $('div.row.restaurant__list-row.js-toggle-result.js-geolocation.js-restaurant__list_items').each((i, elem) => {
    if (i <= 39) {
      data.push({
        name: $(elem).find('h5').text().trim(),
        city: $(elem).find('div.card__menu-footer--location.flex-fill.pl-text').text().trim()
      })
    }
  });

  console.log(data);
}

scrapeRealtor();