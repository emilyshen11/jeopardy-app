const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const log = require('simple-node-logger').createSimpleLogger();
const app = express();

const JEOPARDY_API_URL = 'http://jservice.io';
const CLUES_ENDPOINT = '/api/clues';
const CATEGORIES_ENDPOINT = '/api/categories';

let categories = [];

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
  res.render('index', { clues: null, categories: categories, error: null});
});

app.post('/search', function(req, res) {
  let min_date = req.body.min_date;
  let max_date = req.body.max_date;
  let category = req.body.category;
  let value = req.body.value;
  let url = `${JEOPARDY_API_URL}${CLUES_ENDPOINT}?min_date=${min_date}&max_date=${max_date}&category=${category}&value=${value}`

  request(url, function(err, response, body) {
    log.info(`Request received: ${url}`);
    if (err) {
      log.error(err);
      res.render('index', { clues: null, categories: categories, error: 'Error, please try again' });
    } else {
      let clues = JSON.parse(body);
      if (clues.length === 0) {
        res.render('index', { clues: null, categories: categories, error: `No clues found`});
      } else {
        res.render('index', { clues: clues, categories: categories, error: null });
      }
    }
  });
});

app.use(function (err, req, res, next) {
  log.error(err);
  res.render('index', { clues: null, categories: categories, error: 'Error, please try again' });
});

app.listen(3000, function () {
  console.log('Jeopardy app listening on port 3000!');
});
