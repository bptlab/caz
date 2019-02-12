var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.json({'index': { title: 'Express' }});
});

router.post('/notification', function (req, res, next) {
  console.log(req.body);
  res.json({ message: "Event received." });
});

module.exports = router;
