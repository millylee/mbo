/*
 * utils
 * https://github.com/millylee/mbo
 *
 * Copyright (c) 2016 millylee
 * Licensed under the MIT license.
 */

'use strict';

var path = require('path'),
    fs = require('fs'),
    fse = require('fs-extra'),
    MarkdownIt = require('markdown-it'),
    fm = require('front-matter'),
    swig = require('swig'),
    rd = require('rd'),
    moment = require('moment');

var md = new MarkdownIt({
    html: true,
    langPrefix: 'code-',
});

swig.setDefaults({
    cache: false
});

// 去掉文件名中的扩展名
function stripExtname(name) {
    var i = 0 - path.extname(name).length;
    if (i === 0) i = name.length;
    return name.slice(0, i);
}

// 将Markdown转换为HTML
function markdownToHTML(content) {
    return md.render(content || '');
}

// 解析文章内容
function parseSourceContent(data) {
    var info = {},
        content = fm(data);
    for(var key in content.attributes) {
        info[key] = content.attributes[key];
        if(info.date) {
            info.date = moment(info.date).format('YYYY-MM-DD');
        }
    }
    info.source = content.body;
    return info;
}

// 渲染模板
function renderFile(file, data) {
    return swig.render(fs.readFileSync(file).toString(), {
        filename: file,
        autoescape: false,
        locals: data
    });
}

// 遍历所有文章
function eachSourceFile(sourceDir, callback) {
    rd.eachFileFilterSync(sourceDir, /\.md$/, callback);
}

// 新建文章
function newPost(dir, title, content) {
    var data = [
        '---',
        'title: ' + title,
        'date: ' + moment().format('YYYY-MM-DD'),
        '---',
        '',
        content
    ].join('\n');
    var name = moment().format('YYYY-MM') + '/' + title + '.md',
        file = path.resolve(dir, '_posts', name);
    // 存在同名文章则改名
    fs.exists(file, function(exists) {
        if(exists) {
            file = file.replace('.md', '1.md')
        }
        fse.outputFileSync(file, data);
    });
}

// 渲染文章
function renderPost(dir, file) {
    var content = fs.readFileSync(file).toString(),
    post = parseSourceContent(content.toString());
    post.content = markdownToHTML(post.source);
    post.layout = post.layout || 'post';
    var config = loadConfig(dir),
        layout = path.resolve(dir, '_layout', post.layout + '.html');

    var html = renderFile(layout, {
        config: config,
        post: post
    });
    return html;
}

// 渲染文章列表
function renderIndex(dir) {
    var list = [];
    var sourceDir = path.resolve(dir, '_posts');
    eachSourceFile(sourceDir, function(f, s) {
        var source = fs.readFileSync(f).toString(),
        post = parseSourceContent(source);
        post.timestamp = new Date(post.date);
        post.url = '/posts/' + stripExtname(f.slice(sourceDir.length + 1)) + '.html';
        list.push(post);
    });

    list.sort(function(a, b) {
        return b.timestamp - a.timestamp;
    });

    var config = loadConfig(dir),
        layout = path.resolve(dir, '_layout', 'index.html'),
        html = renderFile(layout, {
        config: config,
        posts: list
    });
    return html;
}

// 读取配置文件
function loadConfig(dir) {
    var content = fs.readFileSync(path.resolve(dir, '.mborc')).toString(),
        data = JSON.parse(content);
    return data;
}

// 输出函数
exports.newPost = newPost;
exports.renderPost = renderPost;
exports.renderIndex = renderIndex;
exports.stripExtname = stripExtname;
exports.eachSourceFile = eachSourceFile;
exports.loadConfig = loadConfig;
