module.exports = {
    "env": {
        "browser": true,
        "node": true,
        "mocha": true,
        "es6": true,
    },
    "parserOptions": {
        "ecmaVersion": 2017,
        "ecmaFeatures": {
            "experimentalObjectRestSpread": true
        }
    },
    "globals": {
        "Promise": true
    },
    "extends": "eslint:recommended",
    "rules": {
        "no-bitwise": "error",
        "eqeqeq": "error",
        "no-eq-null": "error",
        "wrap-iife": [
            "error",
            "any"
        ],
        "no-use-before-define": [
            "error",
            {
                "functions": false
            }
        ],
        "new-cap": "error",
        "no-new": "error",
        "no-caller": "error",
        "no-undef": "error",
        "max-len": [
            "error",
            {
                "code": 200,
                "ignoreComments": true
            }
        ],
        "semi": [
            "error",
            "always"
        ],
        "no-const-assign": "error",
        "quotes": [
            "error",
            "single",
            {
                "avoidEscape": true
            }
        ],
        "quote-props": [
            "error",
            "as-needed",
            {
                "numbers": true
            }
        ],
        "no-console": "off",
        "no-cond-assign": "error",
    }
};
