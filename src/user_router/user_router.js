const express = require('express');
const bodyParser = require('body-parser');
const recordController = require('../user_controller/user_controller');

const router = express.Router();

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

router.get('/records', recordController.getRecords);
router.get('/records/:token', recordController.getRecordByToken);
router.post('/records', recordController.postRecord || recordController.createRecord);
router.put('/records/:id', recordController.updateRecord);
router.delete('/records/:id', recordController.deleteRecord);

module.exports = router;