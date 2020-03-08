module.exports = {
  'root':true,
  'parser': '@typescript-eslint/parser',
  'parserOptions': {
    'ecmaVersion': 6,
    'sourceType': 'module',
    'ecmaFeatures': {
        'modules': true
    },
    'project': './tsconfig.json'
  },
  'plugins': ['@typescript-eslint'],
  'rules': {
    'quotes':[
      'error',
      'single',
      {
          avoidEscape: true,
          allowTemplateLiterals: true
      }
    ],
    'indent': [
      'error',
      2,
      {
          SwitchCase: 1,
          flatTernaryExpressions: true
      }
    ],
    '@typescript-eslint/restrict-plus-operands': 'error',
    '@typescript-eslint/explicit-member-accessibility': 0,
    '@typescript-eslint/explicit-function-return-type': 0,
    '@typescript-eslint/no-explicit-any': 0,
    'no-control-regex': 0,
    'no-useless-escape': 0,    
    'no-prototype-builtins': 0
  },
  'extends': [
    'eslint:recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended'
  ]
}