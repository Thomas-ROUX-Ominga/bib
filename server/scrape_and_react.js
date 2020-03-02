//----------------BIB-GOURMAND----------------\\
var axios = require('axios');
var cheerio = require('cheerio');
var bibs = [];
var mrs = [];
var interRest = [];


async function scrapeBIB(n) {
  const html = await axios.get('https://guide.michelin.com/fr/fr/restaurants/bib-gourmand/page/'+n);
  const $ = await cheerio.load(html.data);

  $('body > main > section.section-main.search-results.search-listing-result > div > div > div.row.restaurant__list-row.js-toggle-result.js-geolocation.js-restaurant__list_items').children().each((i, elem) => {
    if (i <= 39) {
      let name = $(elem).find('h5').text().trim();
      let city = $(elem).find('div.card__menu-footer--location.flex-fill.pl-text').text().trim();
      if ((name != '')&&(city != '')){
        bibs.push({
        name: name.toLowerCase(),
        city: city.toLowerCase()
        })
      }
    }
    //console.log(bibs);
  });
}

async function scrapeAllBIB(){
  for (let n = 1; n<16; n++){
    await scrapeBIB(n);
  }
}

//scrapeAllBIB();

//----------------MAITRE-RESTAURATEUR----------------\\
const querystring = require('querystring');

async function scrapeMR(page) {
  const payload = {
    'page' : page,
    'request_id' : 'c2017c5c4acb3217c38c57d3f4584467'
  };

  const options= {
    'url' : 'https://www.maitresrestaurateurs.fr/annuaire/ajax/loadresult',
    'method' : 'POST',
    'data' : querystring.stringify(payload)
  };

  const html = await axios(options);
  const $ = await cheerio.load(html.data);

  $('body').find('.annuaire_result_list').children().each((i, elem) => {
        if (page != 155){
          if (i <= 9) {
            if($(elem).find("div.single_libel").text().trim() != null){
              let name = $(elem).find("div.single_libel").text().trim();
              let city =  $(elem).find("div.single_desc > div.single_details > div > div:nth-child(2) > div").text().trim();
  
              name = clear_name(name);
              city = clear_city(city);
  
              if ((name != '')&&(city != '')){
                mrs.push({
                name: name.toLowerCase(),
                city: city.toLowerCase()
                })
              }
            }
          }
        }
        else{
          if (i <= 2) {
            if($(elem).find("div.single_libel").text().trim() != null){
              let name = $(elem).find("div.single_libel").text().trim();
              let city =  $(elem).find("div.single_desc > div.single_details > div > div:nth-child(2) > div").text().trim();
  
              name = clear_name(name);
              city = clear_city(city);
  
              mrs.push({
              name: name.toLowerCase(),
              city: city.toLowerCase()
              })
            }
          }
        }
      //console.log(mrs);
    });
}

function clear_name(name) {
  var new_name = "";
  let i = 0;
  while (name.charAt(i) != "("){
    new_name += name[i];
    i++;
  }
  return new_name.trim();
}

function clear_city(city) {
  var n = city.search('\n              \n');
  var new_city = city.substr(n);
  return new_city.trim().slice(6);
}

async function scrapeAllMR(){
  for (let n = 1; n<156; n++){
    await scrapeMR(n);
  }
}

//scrapeAllMR();

//----------------INTERSECT-&-REACT----------------\\

async function intersect(){
  for (const mr of mrs){
    for (const bib of bibs){
      if ((mr.name.includes(bib.name))&&(mr.city.includes(bib.city))&&(mr.name != '')){
        interRest.push(bib);
      }
    }
  }
}

//----------------MAIN----------------\\

async function main(){
  await scrapeAllBIB();
  await scrapeAllMR();

  await intersect();

  console.log(await interRest);
}

main();