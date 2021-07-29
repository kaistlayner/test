var express = require('express');
var router = express.Router();

/*router.use(function timeLog(req, res, next) {
  console.log('Time: ', Date.now());
  next();
});*/
var requestTime = function (req, res, next) {
  var now = Date.now()/1000/60/60/24/365;
  req.year = now - now%1;
  now -= req.year; now *= 365; req.year += 2021 - 51;
  req.day = now - now%1;
  now -= req.day; now *= 24;
  req.hour = now - now%1;
  now -= req.hour; now *= 60; req.hour -= 3;
  req.min = now - now%1;
  now -= req.min; now *= 60;
  req.sec = now - now%1;
  now -= req.sec; now *= 60;
  req.micro = now;
  next();
};

router.use(requestTime);

/* GET home page. */
router.get('/', function(req, res, next) {
  //res.render('index', { title: 'Express' });
  var responseText = 'Hello World!';
  responseText += `\n\nRequested at: ${req.year}y ${req.day}d ${req.hour}h ${req.min}m ${req.sec}s!`;
  res.send(responseText);
});

router.route('/book')
  .get(function(req, res) {
    res.send('Get a random book');
  })
  .post(function(req, res) {
    res.send('Add a book');
  })
  .put(function(req, res) {
    res.send('Update the book');
  });

module.exports = router;
