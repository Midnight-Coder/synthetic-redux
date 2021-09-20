module.exports = {
  presets: [['@babel/preset-env', { "targets": "> 2%", "loose": true }]],
  plugins: [["@babel/plugin-proposal-class-properties", { "loose": true }]]
};
