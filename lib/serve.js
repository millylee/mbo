/*
 * serve static with livereload
 * https://github.com/millylee/mbo
 *
 * Copyright (c) 2016 millylee
 * Licensed under the MIT license.
 */

'use strict';

var express = require('express'),
    serveStatic = require('serve-static'),
    path = require('path'),
    open = require('open'),
    utils = require('./utils');

module.exports = function(dir) {
    dir = dir || '.';

    // 初始化express
    var app = express(),
        router = express.Router();
    app.use('assets', serveStatic(path.resolve(dir, 'assets')));
    app.use(router);

    // 渲染文章
    router.get('/posts/*', function(req, res, next) {
        var name = utils.stripExtname(req.params[0]),
            file = path.resolve(dir, '_posts', name + '.md'),
            html = utils.renderPost(dir, file);
        res.end(html);
    });

    // 渲染列表
    router.get('/', function(req, res, next) {
        var html = utils.renderIndex(dir);
        res.end(html);
    });

    var config = utils.loadConfig(dir),
        host = config.host || 'http://127.0.0.1',
        port = config.port || 8777,
        url = host + ':' + port;
    app.listen(port);
    open(url);
};
