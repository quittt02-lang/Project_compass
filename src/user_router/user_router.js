//const Router = require('../Body_js/body');
const express = require('express');
const bodyParser = require('body-parser');
const recordController = require('../user_controller/user_controller');

const router = express.Router();

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

router.get('/records', recordController.getRecords);
router.get('/records/:token', recordController.getRecordByToken);
router.post('/records', recordController.createRecord);
router.put('/records/:id', recordController.updateRecord);

module.exports = router;