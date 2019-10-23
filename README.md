# jeopardy-app

## Description

This app allows users to search for past Jeopardy questions by:
- Date or timeframe aired
- Trivia category
- Value of the question in dollars

## Technology used

The code runs on Node.js and uses the Express web application framework. The EJS (Embedded JavaScript) templating language is used to dynamically load HTML pages. The app is deployed live on Heroku at this URL: https://jeopardy-search-app.herokuapp.com/

## Local development

In order to run this app locally, you need to have Node.js installed: https://nodejs.org/en/download/. Then, install dependencies with:
```
npm install
```
and start the app with:
```
node server.js
```
and navigate to `http://localhost:3000/`. The app runs on port 3000 by default, so in order to run the app on another port, you can set the `PORT` environment variable before starting the app:
```
export PORT=8080
```
To run the app with live reloading, install nodemon:
```
npm install -g nodemon
```
and run the app with nodemon instead of node:
```
nodemon server.js
```
