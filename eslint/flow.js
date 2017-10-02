module.exports = {
    "settings": {
        "flowtype": {
            "onlyFilesWithFlowAnnotation": true
        }
    },
    "plugins": [
        "flowtype",
        "flowtype-errors"
    ],
    "rules": {
        "flowtype/boolean-style": ["error", "boolean"],
        "flowtype/define-flow-type": "error",
        "flowtype/delimiter-dangle": ["error", "never"],
        "flowtype/generic-spacing": ["error", "never"],
        "flowtype/no-dupe-keys": "error",
        "flowtype/no-primitive-constructor-types": "error",
        "flowtype/no-types-missing-file-annotation": "error",
        "flowtype/no-weak-types": "error",
        "flowtype/object-type-delimiter": ["error", "comma"],
        "flowtype/require-parameter-type": "error",
        "flowtype/require-return-type": "error",
        "flowtype/require-valid-file-annotation": ["error", "never", {
            "annotationStyle": "line"
        }],
        "flowtype/require-variable-type": "off",
        "flowtype/semi": ["error", "always"],
        "flowtype/sort-keys": "off",
        "flowtype/space-after-type-colon": ["error", "always"],
        "flowtype/space-before-generic-bracket": ["error", "never"],
        "flowtype/space-before-type-colon": ["error", "never"],
        "flowtype/type-id-match": "off",
        "flowtype/union-intersection-spacing": ["error", "always"],
        "flowtype/use-flow-type": "error",

        "flowtype-errors/show-errors": "error",
        "flowtype-errors/enforce-min-coverage": ["warn", 50]
    }
};
