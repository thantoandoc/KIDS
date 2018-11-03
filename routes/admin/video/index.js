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


module.exports = router;