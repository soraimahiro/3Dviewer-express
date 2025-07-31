var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function (req, res, next) {
    res.send('respond with a resource');
});

router.get('/:one/:two', function (req, res, next) {
    res.send(req.params.one + ' ' + req.params.two);
});

module.exports = router;
