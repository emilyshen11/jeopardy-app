const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const app = express()

const JEOPARDY_API_URL = 'http://jservice.io'
const CLUES_ENDPOINT = '/api/clues'
const CATEGORIES_ENDPOINT = '/api/categories'

let categories;

request(`${JEOPARDY_API_URL}${CATEGORIES_ENDPOINT}?count=100`, function(err, response, body) {
  if (err) {
    console.log('Unable to fetch categories')
  } else {
    categories = body
  }
});

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs')

app.get('/', function(req, res) {
  res.render('index', { clues: null, error: null});
});

app.post('/search', function(req, res) {
  let min_date = req.body.min_date;
  let max_date = req.body.max_date;
  let url = `${CLUES_ENDPOINT}?min_date=${min_date}&max_date=${max_date}`

  request(url, function(err, response, body) {
    console.log(body)
    if (err) {
      res.render('index', { clues: null, error: 'Error, please try again' });
    } else {
      let clues = JSON.parse(body)
      if (clues.length === 0) {
        res.render('index', { clues: null, error: `No clues found`});
      } else {
        res.render('index', { clues: clues, error: null });
      }
    }
  });
});

app.use(function (err, req, res, next) {
  console.log(err)
  res.render('index', { clues: null, error: 'Error, please try again' });
});

app.listen(3000, function () {
  console.log('Jeopardy app listening on port 3000!')
});
