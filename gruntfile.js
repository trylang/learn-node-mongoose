module.exports = function(grunt) {

    grunt.initConfig({
        watch: {
            pug: {
                files: ['views/**'],
                options: {
                    livereload: true
                }
            },
            js: {
                files: ['public/js/**', 'models/**/*.js', 'schemas/**/*.js'],
                tasks: ['jshint'],
                options: {
                    livereload: true
                }
            },
            uglify: {
                files: ['public/**/*.js'],
                tasks: ['jshint'],
                options: {
                    livereload: true
                }
            },
            styles: {
                files: ['public/**/*.js'],
                tasks: ['less'],
                options: {
                    npspawn: true
                }
            }
        },
        jshint: {
            options: {
                jshint: '.jshintrc',
                ignores: ['public/libs/**/*.js']
            },
            all: ['public/js/*.js', 'test/**/*.js', 'app/**/*.js']
        },
        less: {
            development: {
                options: {
                    compress: true,
                    yuicompress: true,
                    optimization: 2
                },
                files: {
                    'public/build/index.css': 'public/less/index.less'
                }
            }
        },
        uglify: {
            development: {
                files: {
                    'public/build/admin.min.js': 'public/js/admin.js',
                    'public/build/detail.min.js': [
                        'public/js/detail.js'
                    ]
                }
            }
        },
        nodemon: {
            dev: {
                script: 'app.js',
                options: {
                    args: [],
                    ignore: ['README.md', 'node_modules/**', '.DS_Store'],
                    ext: 'js',
                    watch: ['./'],
                    debug: true,
                    delay: 10,
                    env: {
                        PORT: 3000
                    },
                    cwd: __dirname
                }
            }
        },

        mochaTest: {
            options: {
                reporter: 'spec'
            },
            src: ['test/**/*.js']
        },

        concurrent: {
            tasks: ['nodemon', 'watch', 'uglify', 'jshint'],
            options: {
                logConcurrentOutput: true
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-nodemon');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-concurrent');
    grunt.loadNpmTasks('grunt-mocha-test'); //第一步：加载测试组件
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-jshint');

    grunt.option('force', true); //遇见bug继续编译
    grunt.registerTask('default', ['concurrent']);
    grunt.registerTask('test', ['mochaTest']); //第二步：注册

};
