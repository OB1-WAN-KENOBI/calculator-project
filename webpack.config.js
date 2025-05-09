const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: "./src/js/index.js",
  output: {
    filename: "bundle.[contenthash].js",
    path: path.resolve(__dirname, "dist"),
    clean: true,
  },
  mode: "development",
  devtool: "inline-source-map",
  devServer: {
    static: "./dist",
    open: true,
    hot: true,
    port: 8080,
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/index.html",
      title: "Calculator",
    }),
  ],
  optimization: {
    minimize: true,
    usedExports: true, // Включает Tree Shaking
    sideEffects: true, // Удаляет неиспользуемые экспорты
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
      // сюда позже можно добавить обработку шрифтов, изображений и прочего
    ],
  },
};
