const bib_list = require('./bib_list');

async function scrape (searchLink, i) {
  try {
    var restaurant = await bib_list.scrapeRi(searchLink, i);

    process.exit(0);
  } catch (e) {
  	console.log('ERROR');
    console.error(e);
    process.exit(1);
  }
}

for (let n = 1; n<16; n++){
	var url = 'https://guide.michelin.com/fr/fr/restaurants/bib-gourmand/page/'+n;
	
	if (n!=15){
		for (let i=1; i<42; i++){
			scrape(url, i);
		}
	}
	else{
			scrape(url, 1);
		}
}