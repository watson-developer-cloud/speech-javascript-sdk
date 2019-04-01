module.exports = {
  "parser": "esprima",
  "env": {
    "node": true,
    "browser": true,
  },
  'globals': {
    // we want to enable a limited sub-set of ES6 features
    // this library should (partially) work even in IE
    // false meaning this code doesn't define it
    Promise: false,
    DataView: false,
    ArrayBuffer: false,
    Float32Array: false
  },
  "plugins": [
    "prettier",
  ],
  "extends": [
    "eslint:recommended",
    "prettier",
  ],
  "rules": {
    "prettier/prettier": ["error", {"singleQuote": true, "printWidth": 160}],
    "no-var": "off",
    "prefer-const": "off",
    "prefer-rest-params": "off",
    "prefer-spread": "off",
  }
};
