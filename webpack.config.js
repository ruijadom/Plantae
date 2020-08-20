const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const IS_DEV = process.env.NODE_ENV !== 'production';

module.exports = {
  mode: IS_DEV ? 'development' : 'production',
  devtool: IS_DEV ? 'inline-source-map' : false,
  target: 'web',
  entry: path.resolve(__dirname, 'src', 'index.tsx'),
  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name].[hash:8].js',
    chunkFilename: '[name].[hash:8].js',
  },

  resolve: {
    extensions: ['.js', '.jsx', '.json', '.ts', '.tsx', '.scss'],
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        loader: 'awesome-typescript-loader',
      },
      {
        enforce: 'pre',
        test: /\.js$/,
        loader: 'source-map-loader',
      },

      {
        test: /\.s(a|c)ss$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              modules: {
                localIdentName: '[local]'
              }
            }
          },
          'sass-loader'
        ]
      },
    ],
  },
  optimization: {
    splitChunks: {
      chunks: 'all',
      minSize: 0,
      maxInitialRequests: 10,
      maxAsyncRequests: 10,
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          name(module, chunks, cacheGroupKey) {
            const packageName = module.context.match(
              /[\\/]node_modules[\\/](.*?)([\\/]|$)/
            )[1];
            return `${cacheGroupKey}.${packageName.replace('@', '')}`;
          },
        },
        common: {
          minChunks: 2,
          priority: -10,
        },
      },
    },
    runtimeChunk: 'single',
  },
  performance: {
    hints: !IS_DEV ? "warning" : false
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'public', 'index.html'),
    }),
    new MiniCssExtractPlugin({
      filename: './src/components/index.css',
    }),
  ],
};
