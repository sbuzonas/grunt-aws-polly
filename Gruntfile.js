'use strict';

module.exports = function (grunt) {
    grunt.initConfig({
        jshint: {
            all: [
                'Gruntfile.js',
                'polly/*.js',
                'tasks/*.js',
                'util/*.js'
            ],
            options: {
                jshintrc: '.jshintrc'
            }
        },
        clean: {
            tests: ['tmp']
        },
        aws_polly_lexicon: {
            test: {
                name: 'pollytest',
                path: 'test/fixtures/lexicon/test.xml'
            }
        }
    });

    // Load this plugin's tasks
    grunt.loadTasks('tasks');

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-clean');

    grunt.registerTask('test', ['clean', 'aws_polly_lexicon']);

    // By default, lint and run all tests.
    grunt.registerTask('default', ['jshint', 'test']);
};
