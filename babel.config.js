module.exports = {
  presets: [['@babel/preset-env', {"targets": "> 2%"}]],
  "plugins": [["@babel/plugin-proposal-class-properties", { "loose": true }]]
};
