var axios = require('axios');
var cheerio = require('cheerio');
const fs = require('fs');

function parse (data,i) {
  var $ = cheerio.load(data);
  var name = $('body > main > section.section-main.section-card-shadow.last > div > div.row.search-results__row.js-search__restaurants > div:nth-child('+i+') > div > div.card__menu-content.js-match-height-content > h5').text().trim();
  var city = $('body > main > section.section-main.section-card-shadow.last > div > div.row.search-results__row.js-search__restaurants > div:nth-child('+i+') > div > div.card__menu-footer.d-flex.js-match-height-footer > div.card__menu-footer--location.flex-fill.pl-text').text().trim();
  fs.appendFile('bibs.txt',name+'\n'+city, (err) => {
				if (err) throw err;
				console.log("File saved !");
				});
  return {name, city};
}

async function scrapeRi (url, i){
  var response = await axios(url);
  var {data, status} = response;

  if (status >= 200 && status < 300) {
    return parse(data,i);
  }

  console.error(status);

  return null;
}

module.exports.scrapeRi = scrapeRi;