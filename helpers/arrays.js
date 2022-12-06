"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
exports.__esModule = true;
exports.isOverlapping = exports.getIntersection = exports.splitArrayToBatches = exports.calculateArraySum = exports.parseIntArray = void 0;
var parseIntArray = function (arr) { return arr.map(function (s) { return parseInt(s); }); };
exports.parseIntArray = parseIntArray;
var calculateArraySum = function (arr) { return arr.reduce(function (a, b) { return a + b; }, 0); };
exports.calculateArraySum = calculateArraySum;
var splitArrayToBatches = function (arr, size) {
    var tmp = __spreadArray([], arr, true);
    var batches = [];
    while (tmp.length) {
        batches.push(tmp.splice(0, size));
    }
    return batches;
};
exports.splitArrayToBatches = splitArrayToBatches;
var getIntersection = function (arrays) {
    var intersection = [];
    var pos = new Array(arrays.length).fill(0);
    var _loop_1 = function () {
        var i = 0;
        while (i < pos.length
            && arrays.every(function (arr, idx) {
                return idx === i || arrays[i][pos[i]] >= arr[pos[idx]];
            })) {
            i++;
        }
        if (i < pos.length) {
            pos[i]++;
        }
        else {
            intersection.push(arrays[0][pos[0]]);
            pos = pos.map(function (p) { return p + 1; });
        }
    };
    while (pos.every(function (p, i) { return p < arrays[i].length; })) {
        _loop_1();
    }
    return intersection;
};
exports.getIntersection = getIntersection;
var isOverlapping = function (_a, _b, full) {
    var s1 = _a[0], e1 = _a[1];
    var s2 = _b[0], e2 = _b[1];
    if (full === void 0) { full = false; }
    if (e1 < s2 || e2 < s1)
        return false;
    if (!full)
        return true;
    return (s1 - s2) * (e1 - e2) <= 0;
};
exports.isOverlapping = isOverlapping;
