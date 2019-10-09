module.exports = {
    "env": {
        "browser": true,
        "node": true,
        "mocha": true,
        "es6": true,
    },
    "parserOptions": {
        "ecmaVersion": 2019,
    },
    "extends": "eslint:recommended",
    "rules": {
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
    }
};
