const cheerio = require('cheerio');
const rp = require('request-promise');
const fs = require('fs');
const michelin = require('./server/michelin');
var restaurants_link = []

for (let n = 1; n<16; n++)
{
	rp({
	method: 'GET',
	url:'https://guide.michelin.com/fr/fr/restaurants/bib-gourmand/page/'+n
	},	(err, res, body) => {

		if (err) return console.error(err);

		let $ = cheerio.load(body);

		let i = 1;

		while((i<=41)&&($('body > main > section.section-main.search-results.search-listing-result > div > div > div.row.restaurant__list-row.js-toggle-result.js-geolocation > div:nth-child('+i+') > div > a').attr("href") != undefined))
		{
			if (i!=9)
			{
				var url = $('body > main > section.section-main.search-results.search-listing-result > div > div > div.row.restaurant__list-row.js-toggle-result.js-geolocation > div:nth-child('+i+') > div > a').attr("href");
				restaurants_link.push(url);
				fs.appendFile('links.txt',url+'\n', (err) => {
					if (err) throw err;
					//console.log("File saved !");
				});
			}
			i++;
		}
	});
}

/*
for (const link of restaurants_link)
{
	rp({
		method: 'GET',
		url:'https://guide.michelin.com'+link
	}, (err, res, body) => {

		if (err) return console.error(err);

		let $ = cheerio.load(body);

		var name = $('body > main > div.restaurant-details > div.container > div > div.col-xl-4.order-xl-8.col-lg-5.order-lg-7.restaurant-details__aside > div.restaurant-details__heading.d-lg-none > h2').text();
		var city = $('body > main > div.restaurant-details > div.container > div > div.col-xl-4.order-xl-8.col-lg-5.order-lg-7.restaurant-details__aside > div.restaurant-details__heading.d-lg-none > ul > li:nth-child(1)').text();

		restaurants_info.push([name,city]);
		fs.appendFile('datas.txt',name+'\n'+city+'\n\n', (err) => {
				if (err) throw err;
				console.log("File saved !");
			});
	});
}*/