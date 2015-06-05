var express = require('express'),
    router = express.Router(),
    appController = require('./controllers/app');

router.get('/', appController.home);
router.get('/about', appController.about);
router.get('/matches/?', appController.matchHistory);
router.get('/match/?', appController.match);

module.exports = router;
