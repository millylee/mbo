/*
 * 生成静态文件
 * https://github.com/millylee/mbo
 *
 * Copyright (c) 2016 millylee
 * Licensed under the MIT license.
 */

'use strict';

var path = require('path'),
    fse = require('fs-extra'),
    utils = require('./utils');

module.exports = function(dir, opts) {
    dir = dir || '.';
    var outputDir = path.resolve(opts.output || dir);

    // 写入文件
    function outputFile(file, content) {
        console.log('生成页面: %s', file.slice(outputDir.length + 1));
        fse.outputFileSync(file, content);
    }

    // 生成文章内容页面
    var sourceDir = path.resolve(dir, '_posts');
    utils.eachSourceFile(sourceDir, function(f, s) {
        var html = utils.renderPost(dir, f),
            relativeFile = utils.stripExtname(f.slice(sourceDir.length + 1)) + '.html',
            file = path.resolve(outputDir, 'posts', relativeFile);
        outputFile(file, html);
    });

    // 生成首页
    var htmlIndex = utils.renderIndex(dir),
        fileIndex = path.resolve(outputDir, 'index.html');
    outputFile(fileIndex, htmlIndex);
};
