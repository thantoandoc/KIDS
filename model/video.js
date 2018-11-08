const mongoose = require('mongoose');
const mongoDBConfig = require('../config/mongoDB');
mongoose.connect(mongoDBConfig.getURLDatabase(), {useNewUrlParser : true}, function (err) {
    if(err) {
        console.log("Cannot connect VideoDB");
    } else{
        console.log("Connect VideoDB successfull");
    }
});

const videoSchema = mongoose.Schema({
    nameVideo : {
        type: String,
    },
    videoURL: {
        type: String,
    },
    description : {
        type: String,
    },
    timePost: {
        type : Number,
    },
    timeUpdate : {
        type : Number,
    }
});

const videoModel = mongoose.model('video', videoSchema);

const insertDocument = (obj, cb) => {
    videoModel.insertMany(obj , cb());
}

module.exports = {
    videoModel,
    insertDocument,
};