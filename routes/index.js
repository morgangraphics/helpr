var express = require('express');
var router = express.Router();

/* GET home page. */

const index = (req, res, next) => {
  res.render('index', { title: 'Express' });
};


router.get('/', index);

module.exports = router;
