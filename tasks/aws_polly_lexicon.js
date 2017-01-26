'use strict';

var lexiconTask = require('../polly/lexicon');

module.exports = function (grunt) {
    grunt.registerMultiTask('aws_polly_lexicon', 'Uploads a lexicon to Polly', lexiconTask.getHandler(grunt));
};
