const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

module.exports = [
  {
    name: 'client',
    target: 'web',
    dependencies: ['host'],
    context: __dirname,
    entry: path.resolve(__dirname, 'src/client/index.tsx'),
    output: {
      path: path.resolve(__dirname, 'build/static'),
      filename: 'main.[chunkhash].js',
    },
    mode: 'development',
    optimization: {
      minimize: true,
      moduleIds: 'deterministic',
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          loader: 'ts-loader',
          exclude: /node_modules/,
          options: {
            // disable type checker - we will use it in fork plugin
            transpileOnly: true,
          },
        },
        {
          test: /\.scss$/,
          use: ['style-loader', 'css-loader', 'sass-loader'],
        },
        {
          test: /\.(?:ico|gif|png|jpg|jpeg)$/i,
          type: 'asset/resource',
        },
        {
          test: /\.(woff(2)?|eot|ttf|otf|svg|)$/,
          type: 'asset/inline',
        },
      ],
    },
    resolve: {
      extensions: [
        '.tsx',
        '.ts',
        '.js',
        '.jsx',
      ],
      plugins: [new TsconfigPathsPlugin()],
    },
    plugins: [
      new CleanWebpackPlugin(),
      new HtmlWebpackPlugin({
        template: path.resolve(__dirname, 'src/client/public/index.html'),
      }),
      new ForkTsCheckerWebpackPlugin({
        eslint: {
          files: './src',
        },
      }),
    ],
  },
  {
    name: 'host',
    target: 'node',
    context: __dirname,
    entry: path.resolve(__dirname, 'src/host/server.ts'),
    output: {
      path: path.resolve(__dirname, 'build'),
      filename: 'server.js',
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          loader: 'ts-loader',
          exclude: /node_modules/,
          options: {
            // disable type checker - we will use it in fork plugin
            transpileOnly: true,
          },
        },
      ],
    },
    resolve: {
      extensions: ['.ts', '.js'],
      plugins: [new TsconfigPathsPlugin()],
    },
    plugins: [
      new CleanWebpackPlugin(),
      new ForkTsCheckerWebpackPlugin({
        eslint: {
          files: './src',
        },
      }),
    ],
    externals: {
      express: 'commonjs express',
    },
  },
];
