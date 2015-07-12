/*jslint node:true*/

'use strict';

var Knigge = require("../");
var testDate = Date.now();
var knigge = new Knigge({
    path: __dirname + '/../testFork/fork.js',
    arguments: ['test', testDate],
    options: {
        silent: false
    }
});

describe('Knigge', function () {
    it('should run a fork', function (done) {
        knigge.start();
        knigge.fork.on('message', function (chunk) {
            if (chunk.test === testDate + '') {
                return done();
            }
        });
    });
});