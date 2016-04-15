module.exports = {
    'env': {
        'browser': true,
        'node': true
    },

  'globals': {
    // false meaning this code doesn't define it
    Promise: false,
    DataView: false,
    ArrayBuffer: false,
    Float32Array: false
  },
  'myrules': {
    'consistent-return': 2,
    'curly': 2,
    eqeqeq: [2, 'smart'],
    'no-alert': 2,
    'no-eq-null': 2,
    'no-eval': 2,
    'no-extend-native': 2
  },
  'extends': 'eslint:recommended',
    'rules': {
        'accessor-pairs': 2,
        'array-bracket-spacing': [
            2,
            'never'
        ],
        'array-callback-return': 2,
        'arrow-body-style': 2,
        'arrow-parens': 2,
        'arrow-spacing': 2,
        'block-scoped-var': 1,
        'block-spacing': 2,
        'brace-style': [
            2,
            '1tbs'
        ],
        'callback-return': 2,
        'camelcase': [
            2,
            {
                'properties': 'never'
            }
        ],
        'comma-spacing': 0,
        'comma-style': [
            2,
            'last'
        ],
        'complexity': 2,
        'computed-property-spacing': [
            2,
            'never'
        ],
        'consistent-this': [ 1, 'self',  'that' ],
        'curly': 2,
        'default-case': 2,
        'dot-location': [
            2,
            'property'
        ],
        'dot-notation': [
            2,
            {
                'allowKeywords': true
            }
        ],
        'eol-last': 2,
        'eqeqeq': [2, 'smart'],
        'func-names': 0,
        'func-style': [
            2,
            'declaration'
        ],
        'generator-star-spacing': 2,
        'global-require': 0,
        'guard-for-in': 2,
        'handle-callback-err': 2,
        'id-blacklist': 2,
        'id-match': 2,
        'indent': [1, 2],
        'jsx-quotes': 2,
        'key-spacing': 2,
        'keyword-spacing': 1,
        'linebreak-style': [
            2,
            'unix'
        ],
        'max-depth': 2,
        'max-len': [
          1,
          {
            'code': 160,
            'tabWidth': 2,
            'ignoreComments': true,
            'ignoreUrls': true
          }
        ],
        'max-nested-callbacks': 2,
        'max-params': 2,
        'new-cap': 2,
        'new-parens': 2,
        'no-alert': 2,
        'no-array-constructor': 2,
        'no-bitwise': [
            2,
            {
                'int32Hint': true
            }
        ],
        'no-caller': 2,
        'no-catch-shadow': 2,
        'no-confusing-arrow': 2,
        'no-continue': 2,
        'no-div-regex': 2,
        'no-else-return': 2,
        'no-eq-null': 2,
        'no-eval': 2,
        'no-extend-native': 2,
        'no-extra-bind': 2,
        'no-extra-label': 2,
        'no-floating-decimal': 2,
        'no-implicit-globals': 2,
        'no-implied-eval': 2,
        'no-inner-declarations': [
            2,
            'functions'
        ],
        'no-invalid-this': 2,
        'no-iterator': 2,
        'no-label-var': 2,
        'no-labels': 2,
        'no-lone-blocks': 2,
        'no-lonely-if': 0,
        'no-loop-func': 2,
        'no-multi-spaces': 1,
        'no-multi-str': 2,
        'no-native-reassign': 2,
        'no-negated-condition': 2,
        'no-nested-ternary': 2,
        'no-new': 2,
        'no-new-func': 2,
        'no-new-object': 2,
        'no-new-require': 2,
        'no-new-wrappers': 2,
        'no-octal-escape': 2,
        'no-proto': 2,
        'no-restricted-imports': 2,
        'no-restricted-modules': 2,
        'no-restricted-syntax': 2,
        'no-return-assign': 2,
        'no-script-url': 2,
        'no-self-compare': 2,
        'no-sequences': 2,
        'no-shadow': 2,
        'no-shadow-restricted-names': 2,
        'no-spaced-func': 2,
        'no-throw-literal': 2,
        'no-trailing-spaces': 2,
        'no-undef-init': 2,
        'no-undefined': 2,
        'no-unmodified-loop-condition': 2,
        'no-unneeded-ternary': 2,
        'no-unused-expressions': 2,
        'no-use-before-define': 2,
        'no-useless-call': 2,
        'no-useless-concat': 2,
        'no-useless-constructor': 2,
        'no-void': 2,
        'no-warning-comments': 1,
        'no-whitespace-before-property': 2,
        'no-with': 2,
        'object-curly-spacing': [
            2,
            'never'
        ],
        'one-var-declaration-per-line': 2,
        'operator-assignment': [
            2,
            'always'
        ],
        'operator-linebreak': 2,
        'quote-props': [2, 'as-needed'],
        'quotes': [1, 'single', 'avoid-escape'],
        'radix': 2,
        'require-jsdoc': 2,
        'require-yield': 2,
        'semi': 1,
        'semi-spacing': [
            2,
            {
                'after': true,
                'before': false
            }
        ],
        'sort-imports': 2,
        'space-before-function-paren': [1, 'never'],
        'space-in-parens': [1, 'never'],
        'space-infix-ops': 1,
        'space-unary-ops': 2,
        'spaced-comment': 1,
        'strict': 2,
        'template-curly-spacing': 2,
        'valid-jsdoc': [2, {
          'requireReturn': false,
          'requireParamDescription': false,
          'requireReturnDescription': false
        }],
        'wrap-iife': 2,
        'yoda': [
            2,
            'never'
        ]
    }
};
