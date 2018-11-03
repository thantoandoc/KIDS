const express = require('express');
const router = express.Router();
const rootPath = '/admin/video/';
const rootRender = 'admin/video/';

router.route('/danh-sach.html').get(function (req, res) {
    res.render(rootRender + 'danhsach',{title : "Hello"});
});

router.route('/').get(function (req, res) {
    res.redirect(rootPath + 'danh-sach.html');
});
router.route('/films.html').get(function (req, res) {
    res.render(rootRender + 'danhsach',{title : "Hello"});
});
router.route('/game-videos.html').get(function (req, res) {
    res.render(rootRender + 'danhsach',{title : "Hello"});
});
router.route('/kid-videos.html').get(function (req, res) {
    res.render(rootRender + 'danhsach',{title : "Hello"});
});
router.route('/sport-videos.html').get(function (req, res) {
    res.render(rootRender + 'danhsach',{title : "Hello"});
});





module.exports = router;