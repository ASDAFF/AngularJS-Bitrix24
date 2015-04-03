module.exports = function(grunt) {

    var vendors = {
        list: [
            'angular-route',
            'requirejs',
            'requirejs-text'
        ],
        paths: {
            'requirejs': '../bower_components/requirejs/require',
            'requirejs-text': '../bower_components/requirejs-text/text'
        }
    };

    var applicationBootScript = './app/boot.js';
    var baseUrl = './app';
    var built = {
        vendors: 'assets/js/vendors.js',
        app: 'assets/js/app.js',
        css: 'assets/css/'
    };

    var uglify2Options = {
        mangle: false,
        compress: {
            sequences: false,
            evaluate: false,
            drop_debugger: false,
            dead_code: false,
            comparisons: false,
            hoist_funs: true,
            hoist_vars: true
        }
    };

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        requirejs: {
            vendors: {
                options: {
                    baseUrl: baseUrl,
                    logLevel: 2, //WARNING
                    out: built.vendors,
                    // optimize: 'none',
                    optimize: 'uglify2',
                    uglify2: uglify2Options,
                    // generateSourceMaps: true, //<-uncomment this line to enable source mapping
                    preserveLicenseComments: false,
                    mainConfigFile: applicationBootScript,
                    include: vendors.list,
                    paths: vendors.paths
                }
            },
            app: {
                options: {
                    baseUrl: baseUrl,
                    logLevel: 2, //WARNING
                    out: built.app,
                    // optimize: 'none',
                    optimize: 'uglify2',
                    uglify2: uglify2Options,
                    // generateSourceMaps: true, //<-uncomment this line to enable source mapping
                    preserveLicenseComments: false,
                    mainConfigFile: applicationBootScript,
                    name: 'boot',
                    exclude: vendors.list,
                    paths: vendors.paths
                }
            }
        },
        less: {
            modules: {
                options: {
                    compress: true,
                    yuicompress: true,
                    optimization: 2,
                    paths: ""
                },
                files:{
                    "./assets/css/style.min.css" : "./app/modules/application/resources/less/application.less"
                }
            }
        },
        copy: {
            images: {
                files: [
                    {
                        expand: true,
                        cwd: "./app/modules/application/resources/",
                        src: "images/**/*.*",
                        dest: "./assets/"
                    }
                ]
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-requirejs');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.registerTask('default', ['requirejs:app', 'requirejs:vendors', 'less:modules', 'copy:images']);
};