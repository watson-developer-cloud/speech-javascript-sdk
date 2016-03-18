module.exports = {
    "env": {
        "browser": true,
        "node": true // not actually, but we're writing code as if it were and letting browserify handle it
    },
    "extends": "eslint:recommended",
    "globals": {
      // false meaning this code doesn't define it
      Promise: false,
      DataView: false,
      ArrayBuffer: false
    },
    "rules": {

    }
};
