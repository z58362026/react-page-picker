const webpack = require('webpack')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const HtmlWebpackHarddiskPlugin = require('html-webpack-harddisk-plugin')
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const apiMocker = require('webpack-api-mocker')
const path = require('path')

const minify = {
    minifyCSS: true,
    minifyJS: true,
    removeComments: true, // 删除HTML中的注释
    collapseWhitespace: true, // 删除空白符与换行符
    collapseBooleanAttributes: true, // 省略布尔属性的值 <input checked="true"/> ==> <input checked />
    removeEmptyAttributes: true, // 删除所有空格作属性值 <input id="" /> ==> <input />
    removeScriptTypeAttributes: true, // 删除script上的type
    removeStyleLinkTypeAttributes: true // 删除style上的type
}

module.exports = options => {
    const env = require('./env/' + options.config + '.js')
    const plugin = require('./env/pro.js').plugin
    const port = env.port || 9999
    const isLocal = options.local
    const libKeys = ['react', 'reactDom', 'reactRouteDom', 'axios', 'propTypes']
    const libs = libKeys.map(item => {
        return {
            url: 'http:' + plugin[item],
            isAsync: false
        }
    })
    const rules = [
        {
            test: /\.js$/,
            use: 'babel-loader',
            include: /src/, // 只转化src目录下的js
            exclude: /node_modules/ // 排除掉node_modules，优化打包速度
        },
        {
            test: /\.scss$/,
            use: [
                isLocal ? 'style-loader' : MiniCssExtractPlugin.loader,
                'css-loader',
                'sass-loader'
            ]
        },
        {
            test: /\.(png|jpg|gif|svg|ico)$/,
            use: [
                {
                    loader: 'url-loader',
                    options: {
                        name: 'images/[name]-[hash:8].[ext]',
                        limit: 1000
                    }
                }
            ]
        }
    ]

    const plugins = [
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            alwaysWriteToDisk: true,
            template: './src/index.ejs',
            filename: 'index.html',
            minify,
            libs
        })
    ]

    if (isLocal) {
        plugins.push(
            new webpack.HotModuleReplacementPlugin(),
            new HtmlWebpackHarddiskPlugin({
                outputPath: path.resolve('dist')
            })
        )
    } else {
        plugins.push(
            new OptimizeCssAssetsPlugin(),
            new MiniCssExtractPlugin({
                filename: 'css/[name]-[hash:8].min.css'
            })
        )
    }

    // 如果是本地开发，使用未压缩的插件
    if (isLocal) {
        for (const key in plugin) {
            plugin[key] = plugin[key]
                .replace('.min', '')
                .replace('.production', '.development')
        }
    }

    // libKeys.forEach(item =>
    //     libs.push({
    //         url: plugin[item],
    //         isAsync: false
    //     })
    // )

    return {
        stats: 'errors-only',
        mode: isLocal ? 'development' : 'production',
        entry: {
            app: './src'
        },
        output: {
            publicPath: isLocal ? 'http://localhost:9999/' : '',
            filename: isLocal ? 'js/[name].js' : 'js/[name]-[hash:8].min.js',
            path: path.resolve('dist'), // 打包后的目录，必须是绝对路径
            chunkFilename: isLocal ? 'js/[name].bundle.js' : 'js/picker-page-picker.min.js'
        },
        resolve: {
            extensions: ['.js', '.json'],
            alias: {
                '@pages': path.join(__dirname, 'src/pages'),
                '@api': path.join(__dirname, 'src/api')
            }
        },
        module: {
            rules
        },
        plugins,
        devtool: isLocal ? 'source-map' : false,
        devServer: {
            port,
            hot: true,
            disableHostCheck: true,
            headers: {
                'Access-Control-Allow-Origin': '*'
            },
            before(app) {
                apiMocker(app, path.resolve('./mock'), {
                    'GET /api/list': 'http://localhost:9999'
                })
            }
        }
    }
}
