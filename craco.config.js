const { ModuleFederationPlugin } = require("webpack").container;

module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      webpackConfig.output.publicPath = "auto"; // Ou o URL do seu microfrontend

      if (!webpackConfig.plugins) {
        webpackConfig.plugins = [];
      }

      webpackConfig.plugins.push(
        new ModuleFederationPlugin({
          name: "app1", // Nome único para este microfrontend
          remotes: {
            authApp: "authApp@http://localhost:3001/remoteEntry.js",
            consorcioApp: "consorcioApp@http://localhost:3002/remoteEntry.js",
            cotasApp: "cotasApp@http://localhost:3003/remoteEntry.js",
          },
          filename: "remoteEntry.js",
          // REMOVIDO: exposes para o host não expor componentes
          // exposes: {
          //   "./App": "./src/App",
          // },
          shared: {
            react: {
              singleton: true,
              eager: true,
              requiredVersion: ">=19.1.1",
            },
            "react-dom": {
              singleton: true,
              eager: true,
              requiredVersion: ">=19.1.1",
            },
            "react-router-dom": {
              singleton: true,
              eager: true,
              requiredVersion: ">=7.8.2",
            },
            // Adicione outras dependências compartilhadas aqui
          },
        })
      );
      return webpackConfig;
    },
  },
};
