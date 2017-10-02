module.exports = {
    "parserOptions": {
        "ecmaVersion": 6,
        "sourceType": "module",
        "ecmaFeatures": {
            "experimentalObjectRestSpread": true
        }
    },
    "rules": {
        "no-compare-neg-zero": "off",
        "no-await-in-loop": "error",
        "no-cond-assign": "warn",
        "no-debugger": "warn",
        "no-dupe-args": "error",
        "no-dupe-keys": "error",
        "no-duplicate-case": "error",
        "no-empty-character-class": "error",
        "no-empty": "warn",
        "no-ex-assign": "error",
        "no-extra-boolean-cast": "warn",
        "no-extra-semi": "warn",
        "no-func-assign": "warn",
        "no-invalid-regexp": "error",
        "no-obj-calls": "error",
        "no-prototype-builtins": "warn",
        "no-regex-spaces": "warn",
        "no-sparse-arrays": "error",
        "no-template-curly-in-string": "error",
        "no-unexpected-multiline": "warn",
        "no-unreachable": "error",
        "no-unsafe-finally": "warn",
        "no-unsafe-negation": "warn",
        "use-isnan": "warn",
        "valid-typeof": "error",

        "accessor-pairs": ["warn", {
            "setWithoutGet" : true,
            "getWithoutSet" : false
        }],
        "array-callback-return": "warn",
        "block-scoped-var": "error",
        "class-methods-use-this": "off",
        "complexity": ["off", {
            "max": 8
        }],
        "consistent-return": ["off", {
            "treatUndefinedAsUnspecified": true
        }],
        "curly": ["warn", "all"],
        "default-case": "off",
        "dot-location": ["warn", "property"],
        "eqeqeq": ["warn", "always"],
        "guard-for-in": "warn",
        "no-alert": "error",
        "no-caller": "error",
        "no-div-regex": "error",
        "no-empty-function": "warn",
        "no-empty-pattern": "warn",
        "no-eq-null": "error",
        "no-eval": "error",
        "no-fallthrough": "error",
        "no-floating-decimal": "warn",
        "no-global-assign": "error",
        "no-implicit-coercion": ["warn", {
            "allow": ["!!", "~", "+"]
        }],
        "no-implied-eval": "error",
        "no-invalid-this": "off",
        "no-iterator": "error",
        "no-lone-blocks": "error",
        "no-loop-func": "warn",
        "no-magic-numbers": ["off", {
            "ignore": [2],
            "ignoreArrayIndexes": true,
            "detectObjects": true
        }],
        "no-multi-spaces": ["warn", {
            "exceptions": {
                "VariableDeclarator": true
            },
            "ignoreEOLComments": true
        }],
        "no-multi-str": "warn",
        "no-new-func": "error",
        "no-new-wrappers": "warn",
        "no-new": "warn",
        "no-proto": "warn",
        "no-return-assign": "warn",
        "no-return-await": "warn",
        "no-script-url": "error",
        "no-self-assign": ["error", {
            "props": false
        }],
        "no-self-compare": "error",
        "no-throw-literal": "warn",
        "no-unused-labels": "warn",
        "no-useless-call": "warn",
        "no-useless-concat": "warn",
        "no-useless-escape": "error",
        "no-useless-return": "warn",
        "no-void": "warn",
        "no-with": "warn",
        "radix": "warn",
        "require-await": "warn",

        "no-catch-shadow": "off",
        "no-delete-var": "error",
        "no-label-var": "warn",
        "no-shadow-restricted-names": "error",
        "no-undef-init": "warn",
        "no-unused-vars": ["warn", {
            "varsIgnorePattern": "React"
        }],
        "no-use-before-define": "warn",

        "no-new-require": "warn",

        "array-bracket-spacing": ["warn", "never"],
        "block-spacing": ["warn", "always"],
        "brace-style": ["warn", "1tbs", {
            "allowSingleLine": true
        }],
        "camelcase": "warn",
        "comma-dangle": ["warn", "never"],
        "comma-spacing": ["warn", {
            "before": false,
            "after": true
        }],
        "comma-style": ["warn", "last"],
        "computed-property-spacing": ["warn", "never"],
        "eol-last": ["warn", "always"],
        "func-call-spacing": ["warn", "never"],
        "func-name-matching": ["warn", "never"],
        "func-names": ["warn", "as-needed"],
        "indent": ["warn", 4, {
            "SwitchCase": 1
        }],
        "jsx-quotes": ["warn", "prefer-double"],
        "key-spacing": ["warn", {
            "singleLine": {
                "beforeColon": false,
                "afterColon": true
            },
            "multiLine": {
                "afterColon": true,
                "align": "colon"
            }
        }],
        "keyword-spacing": ["warn", {
            "overrides": {
                "if": {
                    "after": false
                },
                "for": {
                    "after": false
                },
                "while": {
                    "after": false
                },
                "catch": {
                    "after": false
                },
                "switch": {
                    "after": false
                },
                "return": {
                    "after": true
                }
            }
        }],
        "new-cap": ["warn", {
            "newIsCap": true,
            "capIsNew": false
        }],
        "new-parens": "warn",
        "newline-after-var": ["warn", "always"],
        "newline-before-return": "warn",
        "newline-per-chained-call": ["warn", {
            "ignoreChainWithDepth": 3
        }],
        "no-bitwise": ["warn", {
            "allow": ["~"]
        }],
        "no-mixed-spaces-and-tabs": "error",
        "no-multiple-empty-lines": ["warn", {
            "max": 1
        }],
        "no-nested-ternary": "warn",
        "no-restricted-syntax": ["off", "FunctionExpression", "WithStatement"],
        "no-tabs": "error",
        "no-trailing-spaces": "warn",
        "no-unneeded-ternary": "warn",
        "no-whitespace-before-property": "error",
        "object-curly-newline": ["off", {
            "ObjectExpression": {
                "minProperties": 1,
                "multiline": true
            },
            "ObjectPattern": "never"
        }],
        "object-curly-spacing": ["warn", "always"],
        "object-property-newline": "warn",
        "operator-linebreak": ["warn", "none"],
        "padded-blocks": ["warn", {
            "blocks": "never",
            "classes": "always",
            "switches": "never"
        }],
        "quote-props": ["warn", "as-needed"],
        "quotes": ["warn", "single", {
            "avoidEscape": true,
            "allowTemplateLiterals": true
        }],
        "semi-spacing": "warn",
        "space-before-blocks": "warn",
        "space-before-function-paren": ["warn", {
            "asyncArrow": "always",
            "anonymous": "never",
            "named": "never"
        }],
        "space-in-parens": ["warn", "never"],
        "space-unary-ops": "warn",
        "template-tag-spacing": "off",
        "unicode-bom": ["error", "never"],

        "arrow-body-style": ["off", "as-needed"],
        "arrow-parens": ["warn", "always"],
        "arrow-spacing": ["warn", {
            "before": true,
            "after": true
        }],
        "constructor-super": "error",
        "generator-star-spacing": ["warn", {
            "before": false,
            "after": true
        }],
        "no-class-assign": "warn",
        "no-const-assign": "error",
        "no-dupe-class-members": "error",
        "no-duplicate-imports": "error",
        "no-new-symbol": "warn",
        "no-this-before-super": "error",
        "no-useless-constructor": "warn",
        "no-useless-rename": "warn",
        "no-var": "warn",
        "prefer-rest-params": "off",
        "prefer-spread": "warn",
        "prefer-template": "warn",
        "require-yield": "error",
        "rest-spread-spacing": ["error", "never"],
        "template-curly-spacing": "error",
        "yield-star-spacing": ["warn", "before"]
    }
};
