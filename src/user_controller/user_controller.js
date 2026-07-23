const Record = require('../user_module/user_module');
const crypto = require('crypto');

const getRecords = async (request, response) => {
    try {
        const records = await Record.find();
        response.status(200).json({
            status: 'success',
            results: records.length,
            data: { records }
        });
    } catch (error) {
        response.status(404).json({
            status: 'fail',
            message: error.message
        });
    }
};

const getRecordByToken = async (request, response) => {
    try {
        const record = await Record.findOne({ token: request.params.token });
        if (!record) {
            return response.status(404).json({
                status: 'fail',
                message: 'Record not found'
            });
        }
        response.status(200).json({
            status: 'success',
            data: { record }
        });
    } catch (error) {
        response.status(400).json({
            status: 'fail',
            message: error.message
        });
    }
};

const createRecord = async (request, response) => {
    try {
        const recordData = { ...request.body };
        
        if (!recordData.token) {
            recordData.token = 'tok_' + crypto.randomBytes(4).toString('hex');
        }
        if (!recordData.date) {
            recordData.date = new Date().toISOString().slice(0, 10);
        }
        if (!recordData.filter) {
            recordData.filter = 'Active';
        }

        const newRecord = await Record.create(recordData);
        response.status(201).json({
            status: 'success',
            data: { record: newRecord }
        });
    } catch (error) {
        response.status(400).json({
            status: 'fail',
            message: error.message
        });
    }
};

const updateRecord = async (request, response) => {
    try {
        const record = await Record.findByIdAndUpdate(request.params.id, request.body, {
            new: true,
            runValidators: true,
            returnDocument: 'after'
        });
        if (!record) {
            return response.status(404).json({
                status: 'fail',
                message: 'Record not found'
            });
        }
        response.status(200).json({
            status: 'success',
            data: { record }
        });
    } catch (error) {
        response.status(400).json({
            status: 'fail',
            message: error.message
        });
    }
};

const deleteRecord = async (request, response) => {
    try {
        const record = await Record.findByIdAndDelete(request.params.id);
        if (!record) {
            return response.status(404).json({
                status: 'fail',
                message: 'Record not found'
            });
        }
        response.status(200).json({
            status: 'success',
            message: 'Record deleted successfully'
        });
    } catch (error) {
        response.status(400).json({
            status: 'fail',
            message: error.message
        });
    }
};

module.exports = {
    getRecords,
    getRecordByToken,
    createRecord,
    updateRecord,
    deleteRecord
};