module.exports = {
  'coverageDirectory': '../coverage',
  'coverageReporters': [
    'json-summary',
    'text-summary',
  ],
  'coverageThreshold': {
    'global': {
      'branches': 75,
      'functions': 75,
      'lines': 75,
      'statements': 75,
    },
  },
  'rootDir': './test',
  'moduleFileExtensions': [
    'js',
    'jsx',
  ],
  'moduleDirectories': [
    'node_modules',
    'src',
  ],
  'verbose': true,
};
