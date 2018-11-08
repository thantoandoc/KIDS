const express = require('express');
const Multer = require('multer');
const { Storage } = require('@google-cloud/storage');

const router = express.Router();
const rootPath = '/admin/video/';
const rootRender = 'admin/video/';

const helper = require('./helper');
const videoModel = require('../../../model/video');

const google_storage = new Storage({
    projectId: "balokids-b413f",
    keyFilename: `${__dirname}/serviceAccountKey.json`,
});
const bucket = google_storage.bucket("gs://balokids-b413f.appspot.com");

const multer = Multer({
    storage: Multer.memoryStorage(),
});


router.route('/danh-sach.html').get(function (req, res) {
    res.render(rootRender + 'danhsach', { title: "Hello" });
});

router.route('/').get(function (req, res) {
    res.redirect(rootPath + 'danh-sach.html');
});
router.route('/films.html').get(function (req, res) {
    res.render(rootRender + 'danhsach', { title: "Hello" });
});
router.route('/game-videos.html').get(function (req, res) {
    res.render(rootRender + 'danhsach', { title: "Hello" });
});
router.route('/kid-videos.html').get(function (req, res) {
    res.render(rootRender + 'danhsach', { title: "Hello" });
});
router.route('/sport-videos.html').get(function (req, res) {
    res.render(rootRender + 'danhsach', { title: "Hello" });
});
router.route("/add-video.html")
    .get(function (req, res) {
        res.render(rootRender + 'add_video', { title: "Add Video" });
    })
    .post(multer.single('selectFile'), function (req, res) {
        console.log(req.body);
        console.log(req.file);
        var file = req.file;
        if (file) {
            helper.uploadVideoToStorage(file, bucket)
                .then((url) => {
                    var videoObject = {
                        nameVideo : req.body.name_video,
                        videoURL  : url,
                        description : req.body.desc_video,
                        timePost : Date.now(),
                        timeUpdate : Date.now(),
                    }
                    videoModel.insertDocument(videoObject, (req, result)=>{
                        res.status(200).json({ "Add_Video": url });    
                    });
                })
                .catch((err) => {
                    console.log(err);
                });
        }

    });





module.exports = router;