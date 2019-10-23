const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const log = require('simple-node-logger').createSimpleLogger();
const app = express();

const JEOPARDY_API_URL = 'http://jservice.io';
const CLUES_ENDPOINT = '/api/clues';
const CATEGORIES_ENDPOINT = '/api/categories';
const PORT = process.env.PORT || 3000

let categories = [];
let filters = [];

request(`${JEOPARDY_API_URL}${CATEGORIES_ENDPOINT}?count=100`, function(err, response, body) {
  if (err) {
    log.error('Unable to fetch categories');
  } else {
    categories = JSON.parse(body);
  }
});

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

app.get('/', function(req, res) {
  res.render('index', { clues: null, categories: categories, filters: filters, error: null});
});

app.post('/search', function(req, res) {
  let filters = req.body;
  console.log(filters);

  let min_date = filters.min_date;
  let max_date = filters.max_date;
  let category = filters.category;
  let value = filters.value;
  let url = `${JEOPARDY_API_URL}${CLUES_ENDPOINT}?min_date=${min_date}&max_date=${max_date}&category=${category}&value=${value}`

  request(url, function(err, response, body) {
    log.info(`Request received: ${url}`);
    if (err) {
      log.error(err);
      res.render('index', { clues: null, categories: categories, filters: filters, error: 'Error, please try again' });
    } else {
      let clues = JSON.parse(body);
      if (clues.length === 0) {
        log.info('Could not find any clues');
        res.render('index', { clues: null, categories: categories, filters: filters, error: `No clues found`});
      } else {
        log.info(`Returned ${clues.length} clues`);
        res.render('index', { clues: clues, categories: categories, filters: filters, error: null });
      }
    }
  });
});

app.use(function (err, req, res, next) {
  log.error(err);
  res.render('index', { clues: null, categories: categories, filters: filters, error: 'Error, please try again' });
});

app.listen(PORT, function () {
  console.log(`Jeopardy app listening on port ${PORT}!`);
});
