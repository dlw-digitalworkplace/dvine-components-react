let path = require("path");
const resources = require("../../scripts/tasks/webpack-resources");

const BUNDLE_NAME = "react-fabric-peoplepicker";
const IS_PRODUCTION = process.argv.indexOf("--production") > -1;

let entry = {
  [BUNDLE_NAME]: "./lib/index.js"
};

module.exports = resources.createConfig(BUNDLE_NAME, IS_PRODUCTION, {
  entry,

  output: {
    libraryTarget: "umd",
    library: "FabricPeoplePicker"
  },

  externals: {
    react: "React",
    "react-dom": "ReactDOM"
  }
});
