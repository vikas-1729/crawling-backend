const express = require('express');
const router = express.Router();

router.use('/api', require('./api'));
router.get('/', function (req, res) {
  return res.status(200).json({
    message: 'page not found',
    success: false,
  });
});

module.exports = router;
