/*
 * 初始化博客
 * https://github.com/millylee/mbo
 *
 * Copyright (c) 2016 millylee
 * Licensed under the MIT license.
 */

'use strict';

var path = require('path'),
    fse = require('fs-extra'),
    chalk = require('chalk'),
    utils = require('./utils');

module.exports = function(dir) {
    dir = dir || '';

    // 创建基本目录
    fse.mkdirsSync(path.resolve(dir, '_layout'));
    fse.mkdirsSync(path.resolve(dir, '_posts'));
    fse.mkdirsSync(path.resolve(dir, 'assets'));
    fse.mkdirsSync(path.resolve(dir, 'posts'));

    // 复制模板文件
    var tplDir = path.resolve(__dirname, '../tpl');
    fse.copySync(tplDir, dir);

    // 创建第一篇文章
    utils.newPost(dir, 'hello, world', '这是我的第一篇文章');
    console.log('');
    console.log(chalk.cyan('  博客初始化成功，请使用"mbo serve"预览'));
};
