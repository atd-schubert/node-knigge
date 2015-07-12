/*jslint node:true*/

'use strict';

var i, rg = {};

rg[process.argv[2]] = process.argv[3];

if (typeof process.send === "function") {
    process.send(rg);
} else {
    console.log('This is no fork!');
}

//process.send