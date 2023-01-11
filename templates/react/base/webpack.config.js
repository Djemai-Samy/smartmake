const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");



module.exports = (env) => {

  const buildFolderName = '<%= services.express && !useDocker ? "public" : "build" %>';
  console.log(process.env);
  <%_if(services.express){_%>
  <%_if(useDocker){_%>
  const proxyPath = `http://${process.env.DOCKER_PROXY ? "<%= `${projectName}-${services.express.appName}-dev` %>": "localhost" }:<%= services.express.port %>`;
  <%_}else{_%>
  const proxyPath = `http://localhost:3001`;
  <%_}_%>
  <%_}_%>


  return {
    entry: "./src/index.<%= useTypescript ? 'tsx' : 'jsx' %>",
    resolve:{
      extensions: ['.tsx', '.js', '.ts', '.jsx', ],
    },
    <%_if(useDocker){_%>
    watch: env.WEBPACK_SERVE,
		watchOptions: {
				// Delay the rebuild after the first change
			aggregateTimeout: 600,

				// Poll using interval (in ms, accepts boolean too)
			poll: 1000,
		},
    <%_}_%>
    output: {
      filename: "bundle.[fullhash].js",
      <%_if(services.express && !useDocker){_%>
      path: path.resolve(__dirname, "..", "<%= services.express.appName %>", "src", buildFolderName),
      <%_}else{_%>
      path: path.resolve(__dirname, buildFolderName),
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
               router: () => proxyPath,
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
  }
  
};
