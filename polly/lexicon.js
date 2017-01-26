'use strict';

var AWS = require('aws-sdk');
var fs = require('fs');

var lexiconTask = {};

var proxy = require('proxy-agent');

// Default chain provider doesn't respect AWS_SHARED_CREDENTIALS_FILE env
var awsCredentialHelper = require('../util/aws-credential-helper');

lexiconTask.getHandler = function (grunt) {
    return function () {
        grunt.config.requires('aws_polly_lexicon.' + this.target + '.name');
        grunt.config.requires('aws_polly_lexicon.' + this.target + '.path');

        var options = this.options({
            RoleArn: null,
            region: 'us-east-1'
        });

        var credentials = awsCredentialHelper.getCredentials(options);
        AWS.config.credentials = credentials;

        if (process.env.https_proxy !== undefined) {
            AWS.config.update({
                httpOptions: { agent: proxy(process.env.https_proxy) }
            });
        }

        if (options.RoleArn !== null) {
            AWS.config.credentials = new AWS.TemporaryCredentials({
                RoleArn: options.RoleArn
            });
        }

        AWS.config.update({region: options.region});

        var lexicon_name = grunt.config.get('aws_polly_lexicon.' + this.target + '.name');
        var lexicon_path = grunt.config.get('aws_polly_lexicon.' + this.target + '.path');

        var done = this.async();

        var polly = new AWS.Polly({
            apiVersion: '2016-06-10'
        });

        var params = {
            Content: fs.readFileSync(lexicon_path, 'utf8'),
            Name: lexicon_name
        };
        polly.putLexicon(params, function(err, data) {
            if (err) {
                grunt.fail.warn('Lexicon upload failed. Error: "' + err.message + '"');
            } else {
                grunt.log.writeln('Lexicon uploaded.');
            }

            done(true);
        });
    };
};

module.exports = lexiconTask;
