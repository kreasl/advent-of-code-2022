"use strict";
exports.__esModule = true;
exports.getTuples = exports.dropWhile = exports.takeWhile = exports.readFile = void 0;
var fs = require("fs");
var H = require("highland");
exports.readFile = H.wrapCallback(fs.readFile);
var takeWhile = function (stream, condition) {
    var conditionIsMet = true;
    return stream
        .consume(function (_, x, push, next) {
        if (conditionIsMet && condition(x)) {
            push(null, x);
        }
        else {
            conditionIsMet = false;
        }
        if (H.isNil(x)) {
            push(null, x);
        }
        else {
            next();
        }
    });
};
exports.takeWhile = takeWhile;
var dropWhile = function (stream, condition) {
    var conditionIsMet = false;
    return stream
        .consume(function (_, x, push, next) {
        if (conditionIsMet || !condition(x)) {
            conditionIsMet = true;
            push(null, x);
        }
        if (!H.isNil(x))
            next();
    });
};
exports.dropWhile = dropWhile;
var getTuples = function (stream, size) {
    var tail = Array(size - 1)
        .fill(0)
        .map(function (_, sz) { return stream.observe().drop(sz); })
        .reverse();
    return stream
        .drop(size - 1)
        .zipAll(H(tail))
        .map(function (arr) { return arr.reverse(); });
};
exports.getTuples = getTuples;
