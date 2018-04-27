const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: {
        // "libs": "./src/test/lib.js",

        // "active/lib": "./src/active/lib.js",
        // "appService/devUrl": "./src/appService/uniformUrl/devUrl.js",
        //  "appService/proUrl": "./src/appService/uniformUrl/proUrl.js",
        //  "appService/url": "./src/appService/uniformUrl/url.js",
        //  "appService/testUrl": "./src/appService/uniformUrl/testUrl.js"

        // "personas/devUrl": "./src/personas/uniformUrl/devUrl.js",
        // "personas/proUrl": "./src/personas/uniformUrl/proUrl.js",
        // "personas/url": "./src/personas/uniformUrl/url.js",
        // "personas/testUrl": "./src/personas/uniformUrl/testUrl.js"

        // "smallPortrait/lib": "./src/smallPortrait/lib.js"
        //  "appService/lib": "./src/appService/lib.js",
        // "personas/lib": "./src/personas/lib.js",
        // "personas/plugin": "./src/personas/plugin.js"
        "personas/crowdLib": "./src/personas/crowdLib.js"
        // "personas/crowdLayer": "./src/personas/crowdLayer.js"
    },
    output: {
        path: path.resolve('./dist'),
        filename: "[name].js"
    },
    module: {
        rules: [
            {
                test: /\.vue$/,
                loader: 'vue-loader',
                options: {
                    loaders: {
                        less: ExtractTextPlugin.extract({
                            use: ['css-loader?minimize'],
                            fallback: 'vue-style-loader'
                        }),
                        css: ExtractTextPlugin.extract({
                            use: ['css-loader'],
                            fallback: 'vue-style-loader'
                        })
                    }
                }
            },
            {
                test: /iview\/.*?js$/,
                loader: 'babel-loader'
            },
            {
                test: /\.css$/,
                use: ExtractTextPlugin.extract({
                    use: ['css-loader?minimize', 'autoprefixer-loader'],
                    fallback: 'style-loader'
                })
            },
            {
                test: /\.less/,
                use: ExtractTextPlugin.extract({
                    use: ['css-loader?minimize', 'autoprefixer-loader', 'less-loader'],
                    fallback: 'style-loader'
                })
            },
            {
                test: /\.(gif|jpg|png|woff|svg|eot|ttf)\??.*$/,
                loader: 'url-loader?limit=102400'
            },
            {
                test: /\.(html|tpl)$/,
                loader: 'html-loader',
                options: {
                    attrs: [
                        'img:src',
                        'link:href'
                    ]
                }
            },
            {
                test: [ /\.js$/, /\.es6$/],
                exclude: /node_modules/,
                use: [
                    // {
                    //     loader: "uglify-loader",
                    //     options: {
                    //         mangle: true
                    //     }
                    // },
                    {
                        loader: "babel-loader"
                    },
                ],
            }
        ]
    },
    plugins: [
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false,
                drop_debugger: true,
                drop_console: true
            }
        }),
        new ExtractTextPlugin({
            filename: '[name].css'
        })
    ],
    resolve: {
        extensions: ['.js', '.vue', '.es6', '.css', '.html'],
        alias: {
            'vue': 'vue/dist/vue.esm.js'
        }
    }
};