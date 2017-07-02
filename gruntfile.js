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

        concurrent: {
            tasks: ['nodemon', 'watch'],
            options: {
                logConcurrentOutput: true
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-nodemon');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-concurrent');

    grunt.option('force', true); //遇见bug继续编译
    grunt.registerTask('default', ['concurrent']);

};
