/*
 * init blog
 * https://github.com/millylee/mbo
 *
 * Copyright (c) 2016 millylee
 * Licensed under the MIT license.
 */

'use strict';

const path = require('path');
const fse = require('fs-extra');
const chalk = require('chalk');
const utils = require('./utils');

module.exports = function(dir) {
    dir = dir || '';

    // copy template files
    var tplDir = path.resolve(__dirname, '../tpl');
    console.log(tplDir, dir);
    fse.copySync(tplDir, dir);

    // create a new markdown post
    utils.newPost(dir, 'hello markdown', 'Just another static blog render.');
    console.log('');
    console.log(chalk.cyan('  blog render sucess, please run [mbo serve] to visit'));
};
