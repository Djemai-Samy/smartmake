const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
module.exports = {
  entry: "./src/index.<%= useTypescript ? 'tsx' : 'jsx' %>",
  resolve:{
    extensions: ['.tsx', '.js', '.ts', '.jsx', ],
  },
  output: {
    filename: "bundle.[fullhash].js",
    <%_if(services.express){_%>
    path: path.resolve(__dirname, "..", "<%= services.express.appName %>", "src", "public"),
    <%_}else{_%>
    path: path.resolve(__dirname, "build"),
    <%_}_%>
  },
  devServer: {
    static: {
      directory: path.join(__dirname, 'public'),
    },
    compress: true,
    port: <%= port %>,
    <%_if(services.express){_%>
      proxy: {
        '/api': {
             target: 'http://localhost:<%= port %>',
             router: () => 'http://localhost:<%= services.express.port %>',
             logLevel: 'debug' /*optional*/
        }
      }
    <%_}_%>
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./public/index.html",
    }),
  ],
  module: {
    rules: [
      {
        test: /\.(js|ts)x?$/,
        exclude: /node_modules/,
        loader: require.resolve("babel-loader"),
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.png|svg|jpg|jpeg|gif|ico$/,
        use: ["file-loader"],
      },
    ],
  },
};
