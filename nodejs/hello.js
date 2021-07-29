var http = require('http');
var fs = require('fs');
var url = require('url');

var a = {};
var b = ['a', 'b'];
a[b[0]] = b[1];
console.log(a['a']);
console.log(a.a);