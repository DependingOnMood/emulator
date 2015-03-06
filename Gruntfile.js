module.exports = function(grunt) {

  'use strict';

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    jshint: {
      options: {
        curly: true,
        eqeqeq: true,
        eqnull: true,
        browser: true,
        strict: true,
        undef: true,
        unused: true,
        bitwise: true,
        forin: true,
        freeze: true,
        latedef: true,
        noarg: true,
        nocomma: true,
        nonbsp: true,
        nonew: true,
        notypeof: true,
        singleGroups: true,
        jasmine: true,
        jquery: true,
        globals: {
          module: false, // for Gruntfile.js
          exports: false, // for protractor.conf.js
          inject: false, // testing angular
          angular: false,
          console: false,
          browser: false, element: false, by: false, // Protractor
        },
      },
      all: ['Gruntfile.js', 'stateService.js', 'gameService.js', 'messageService.js', 'alphaBetaService.js', 'resizeGameAreaService.js']
    },
    concat: {
      options: {
        separator: ';',
      },
      dist: {
        src: ['stateService.js', 'gameService.js', 'messageService.js', 'alphaBetaService.js', 'resizeGameAreaService.js'],
        dest: 'dist/gameServices.js',
      },
    },
    uglify: {
      options: {
        sourceMap: true,
      },
      my_target: {
        files: {
          'dist/gameServices.min.js': ['dist/gameServices.js']
        }
      }
    },
    processhtml: {
      dist: {
        files: {
          'platform.min.html': ['platform.html']
        }
      }
    }
  });
  
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-processhtml');

  // Default task(s).
  grunt.registerTask('default', ['jshint', 'concat', 'uglify', 'processhtml']);

};
