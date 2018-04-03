module.exports = {
  'extends': ['standard', 'plugin:node/recommended'],
  'globals': {
    'describe': false,
    'it': false
  },
  'parser': 'babel-eslint',
  'plugins': [
    'node'
  ],
  'rules': {
    'new-cap': ['error', { 'newIsCapExceptions': ['sha256'], 'capIsNewExceptions': ['DrawerNavigator', 'StackNavigator'] }],
    'object-curly-newline': 'off',
    'object-curly-spacing': ['error', 'always'],
    'object-property-newline': ['error', { 'allowMultiplePropertiesPerLine': true }],
    'space-before-function-paren': ['error', 'never']
  }
}
