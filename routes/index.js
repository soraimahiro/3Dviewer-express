var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', { title: '3D model viewer demo' });
});

router.get('/:viewer', function (req, res, next) {
    const viewer = req.params.viewer;
    const file = 'cube.glb';
    res.render(viewer, { title: viewer, file: file });
});

router.get('/:viewer/:file', function (req, res, next) {
    const viewer = req.params.viewer;
    const file = req.params.file;
    res.render(viewer, { title: viewer, file: file });
});

module.exports = router;
