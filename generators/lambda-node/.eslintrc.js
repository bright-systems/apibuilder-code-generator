module.exports = {
  'extends': 'standard',
  'globals': {
    'describe': false,
    'it': false
  },
  'rules': {
    'object-curly-newline': 'off',
    'object-curly-spacing': ['error', 'always'],
    'object-property-newline': ['error', { 'allowMultiplePropertiesPerLine': true }],
    'space-before-function-paren': ['error', 'never']
  }
}
