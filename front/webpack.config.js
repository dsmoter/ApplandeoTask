const path = require('path');
const config = require('./config.json');

module.exports = {
    entry: [
        './src/index.js'
    ],
    output: {
        path: path.join(__dirname, 'dist'),
        publicPath: '/',
        filename: 'bundle.js',
    },
    devServer: {
        contentBase: './dist',
        historyApiFallback: true
    },
    module: {
        rules: [
          {
            test: /\.(js|jsx)$/,
            exclude: /node_modules/,
            use: ['babel-loader']
          },
          {
            test: /\.css$/,
            use: ['style-loader','css-loader']
          }
        ],
      },
    resolve: {
        extensions: ['*', '.js', '.jsx']
    },
    externals: {
        Config: JSON.stringify(config)
    }
}