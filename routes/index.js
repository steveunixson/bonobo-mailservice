const express = require('express');

const router = express.Router();
const controller = require('../controllers/sendmail');
/* GET home page. */
router.get('/', controller.renderIndex);
router.get('/download', controller.getLeads);
router.post('/email', controller.postEmail);

module.exports = router;
