const Record = require('../user_module/user_module');

const getRecords = async (req, res) => {
    try {
        const records = await Record.find();
        res.status(200).json({
            status: 'success',
            results: records.length,
            data: { records }
        });
    } catch (err) {
        res.status(404).json({
            status: 'fail',
            message: err.message
        });
    }
};

const getRecordByToken = async (req, res) => {
    try {
        const record = await Record.findOne({ token: req.params.token });
        if (!record) {
            return res.status(404).json({
                status: 'fail',
                message: 'Record not found'
            });
        }
        res.status(200).json({
            status: 'success',
            data: { record }
        });
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err.message
        });
    }
};

const createRecord = async (req, res) => {
    try {
        const newRecord = await Record.create(req.body);
        res.status(201).json({
            status: 'success',
            data: { record: newRecord }
        });
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err.message
        });
    }
};

const updateRecord = async (req, res) => {
    try {
        const record = await Record.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        if (!record) {
            return res.status(404).json({
                status: 'fail',
                message: 'Record not found'
            });
        }
        res.status(200).json({
            status: 'success',
            data: { record }
        });
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err.message
        });
    }
};

module.exports = {
    getRecords,
    getRecordByToken,
    createRecord,
    updateRecord
};