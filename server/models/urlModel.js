const mongoose = require('mongoose');
const shortId = require('shortid');

const urlSchema = new mongoose.Schema({
    original_url: {
        type: String,
        required: true,
    },
    short_code: {
        type: String,
        required: true,
        default: shortId.generate,
    },
}, { timestamps: true });

module.exports = mongoose.model('Url', urlSchema);

