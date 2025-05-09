const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

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
    static: {
      directory: path.resolve(__dirname, "dist"),
    },
    open: true,
    hot: true,
    port: 8080,
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, "src", "index.html"), // единственный ваш HTML-шаблон
      filename: "index.html", // чётко указываем имя выходного файла
      inject: "body", // сюда плагин вставит <script>
    }),
    new MiniCssExtractPlugin({
      filename: "[name].[contenthash].css", // имя итогового CSS
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
        use: [
          // вместо "style-loader" вставляем загрузчик плагина
          MiniCssExtractPlugin.loader,
          "css-loader",
        ],
      },
    ],
  },
};
