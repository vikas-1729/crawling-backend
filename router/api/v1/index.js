const express = require('express');
const router = express.Router();
const homeController = require('../../../controller/api/v1');

router.get('/mostSearch', homeController.mostSearch);
router.post('/searchByTag/:tagName', homeController.home);
router.post('/content', homeController.content);
module.exports = router;
