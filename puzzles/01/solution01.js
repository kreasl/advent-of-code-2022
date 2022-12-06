"use strict";
exports.__esModule = true;
var arrays_1 = require("../../helpers/arrays");
var streams_1 = require("../../helpers/streams");
var output = process.stdout;
(0, streams_1.readFile)('input.txt')
    .splitBy('\n\n')
    .map(function (str) { return str.split('\n'); })
    .map(arrays_1.parseIntArray)
    .map(arrays_1.calculateArraySum)
    .sortBy(function (a, b) { return b - a; })
    .batch(3)
    .map(arrays_1.calculateArraySum)
    .map(JSON.stringify)
    .intersperse('\n')
    .head()
    .pipe(output);
