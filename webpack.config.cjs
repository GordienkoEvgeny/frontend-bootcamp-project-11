// Generated using webpack-cli https://github.com/webpack/webpack-cli
const autoprefixer = require('autoprefixer');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const WorkboxWebpackPlugin = require('workbox-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
  },
  devServer: {
    open: true,
    host: 'localhost',
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'index.html',
    }),
  ],
  module: {
    rules: [
      {
        test: /\.(eot|svg|ttf|woff|woff2|png|jpg|gif)$/i,
        type: 'asset',
      }, {
        test: /\.(scss)$/,
        use: [{
          // вставить CSS на страницу
          loader: 'style-loader',
        }, {
          // переводит CSS в модули CommonJS
          loader: 'css-loader',
        }, {
          // Выполнить действия postcss
          loader: 'postcss-loader',
          options: {
            // `postcssOptions` требуется для postcss 8.x;
            // если Вы используете postcss 7.x пропустите ключ
            postcssOptions: {
              plugins: () => [autoprefixer],
            },
          },
        }, {
          // компилирует Sass в CSS
          loader: 'sass-loader',
        }],
      },

      // Add your rules for custom modules here
      // Learn more about loaders from https://webpack.js.org/loaders/
    ],
  },
};
