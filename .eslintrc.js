module.exports = {
    "env": {
        "browser": true,
        "node": true,
        "mocha": true,
        "es6": true
    },
    "parserOptions": {
        "ecmaVersion": 2019
    },
    "extends": "eslint:recommended",
    "rules": {
        "no-unused-vars": [
            "error",
            {
                "caughtErrors": "all"
            }
        ],
        "no-use-before-define": [
            "error",
            {
                "functions": false
            }
        ],
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
        "no-cond-assign": "off",
        "object-curly-spacing": [
            "error",
            "always"
        ],
        "object-curly-newline": [
            "error",
            {
                "multiline": true,
                "consistent": true
            }
        ],
        "comma-dangle": [
            "error",
            "never"
        ],
        "comma-spacing": [
            "error",
            {
                "before": false,
                "after": true
            }
        ],
        "comma-style": [
            "error",
            "last"
        ],
        "eol-last": "error",
        "indent": [
            "error",
            4
        ],
        "no-extra-parens": "error",
        "no-mixed-spaces-and-tabs": "error",
        "no-multi-spaces": "error",
        "no-multi-str": "error"
    }
};
