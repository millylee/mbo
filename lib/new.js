/*
 * 新建文章
 * https://github.com/millylee/mbo
 *
 * Copyright (c) 2016 millylee
 * Licensed under the MIT license.
 */

'use strict';

var chalk = require('chalk'),
    inquirer = require('inquirer'),
    utils = require('./utils');

module.exports = function(postname) {
    if(!postname) {
        createPostName();
    }
};

// 输入文章名
function createPostName() {
    inquirer.prompt([{
        type: "input",
        name: "postname",
        message: "请输入文章名，支持英文字母、中划线: "
    }]).then(function(res) {
        if (res.postname) {
            // 创建第一篇文章
            utils.newPost('.', res.postname, '');
            console.log('');
            console.log(chalk.cyan('  新建文章 %s 成功，请使用"mbo serve"预览'), res.postname);
        } else {
            console.log('');
            console.log(chalk.red('文章名不能为空\n'));
            createPostName();
        }
    });
}
