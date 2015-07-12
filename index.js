/*jslint node:true*/

/**
 * Knigge is a module to handle forks in a class.
 */

'use strict';


var forkFn = require('child_process').fork;
var EventEmitter = require('events').EventEmitter;
var util = require('util');

/**
 *
 * @param opts
 * @returns {Knigge}
 * @constructor
 */
var Knigge = function (opts) {
    var self;
    self = this;

    if (!this) {
        return new Knigge(opts);
    }
    // Properties
    this.fork = null;
    this.timeout = null;
    this.interval = null;
    this.path = null;
    this.options = null;

    // Methods

    /**
     * Start a fork on timeout
     * @param val {number} - Milliseconds to wait to call fork
     * @param [force] {boolean} - Run fork again, even if there is a fork already running
     * @returns {Knigge#}
     */
    this.setTimeout = function (val, force) {
        this.emit('setTimeout');
        this.clearTimeout(this.timeout);
        this.timeout = setTimeout(function () {
            this.emit('runTimeout');
            this.start(force);
            this.timeout = null;
        }.bind(this), val);
        return this;
    };
    /**
     * Clear a timeout for a fork
     * @returns {Knigge#}
     */
    this.clearTimeout = function () {
        this.emit('clearTimeout');
        if (this.timeout !== null) {
            clearTimeout(this.timeout);
            this.timeout = null;
        }
        return this;
    };
    /**
     * Start a process in interval
     * @param val {number} - Milliseconds to call interval
     * @param [force] {boolean}
     * @returns {Knigge#}
     */
    this.setInterval = function (val, force) {
        this.emit('setInterval');

        this.clearInterval();
        this.interval = setInterval(function () {
            this.emit('runTimeout');
            this.start(force);
            this.interval = null;
        }.bind(this), val);
        return this;
    };
    /**
     * Clear the setted interval
     * @returns {Knigge#}
     */
    this.clearInterval = function () {
        this.emit('clearInterval');
        if (this.interval) {
            clearInterval(this.interval);
            this.interval = null;
        }
        return this;
    };
    /**
     * Set path of fork node script
     * @param val {path} - Path of the fork node script
     * @returns {Knigge#}
     */
    this.setPath = function (val) {
        this.emit('setPath', val);
        this.path = val;
        return this;
    };
    /**
     * Set arguments to call fork
     * @param val {Array} - Set arguments array
     * @returns {Knigge#}
     */
    this.setArguments = function (val) {
        this.emit('setArguments', val);
        this.arguments = val;
        return this;
    };
    /**
     * Set options for fork call
     * @param val {{}} - Options-object
     * @returns {Knigge}
     */
    this.setOptions = function (val) {
        this.emit('setOptions', val);
        this.options = val;
        return this;
    };
    /**
     * Start the fork
     * @param [force] {boolean} - Start even if a process is already running
     * @returns {*}
     */
    this.start = function (force) {
        var err;
        this.emit('start');
        if (this.fork !== null && !force) {
            err = new Error('There is already a running fork!');
            this.emit('error', err);
            return err;
        }
        this.fork = forkFn(this.path, this.arguments, this.options);
        this.fork.on('exit', function (a, b) {
            self.emit('exit', a, b);
            self.fork = null;
        });
        return this;
    };
    /**
     * Restart the fork
     * @returns {Knigge}
     */
    this.restart = function () {
        this.emit('restart');
        if (!this.fork) {
            return this.start();
        }
        this.stop().once('exit', function () {
            self.start();
        });
        return this;
    };
    /**
     * Stop the fork if running
     * @returns {Knigge}
     */
    this.stop = function () {
        this.emit('stop');
        if (this.fork) {
            this.fork.kill('SIGHUP');
        }
        return this;
    };

    if (opts.timeout) {
        this.setTimeout(opts.interval);
    }
    if (opts.interval) {
        this.setInterval(opts.interval);
    }

    if (opts.path) {
        this.setPath(opts.path);
    }

    if (opts.arguments) {
        this.setArguments(opts.arguments);
    }
    if (opts.options) {
        this.setOptions(opts.options);
    }

};

util.inherits(Knigge, EventEmitter);

module.exports = Knigge;
