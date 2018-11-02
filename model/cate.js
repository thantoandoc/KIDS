const mongoose = require("mongoose");
const Cate = new mongoose.Schema({
    name: { type: String },
    namekhongdau: { type: String }
}, { collection: 'cate' });
module.exports = mongoose.model('cate', Cate);