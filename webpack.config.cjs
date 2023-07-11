const path = require("path")
const Dotenv = require('dotenv-webpack');
module.exports = {
    entry: ['./public/js/app.js', './public/js/party.js', './public/js/assistance.js', './public/js/deleteComment.js'],
    output: {
        filename: 'bundle.js',
        path: path.join(__dirname, "./public/dist")
    },
    module: {
        rules: [
        {
            test: /\.m?js$/,
            use: {
            loader: 'babel-loader',
            options: {
                presets: ['@babel/preset-env']
            }
            }
        }
        ]
    },
    plugins: [
        new Dotenv()
    ]
}