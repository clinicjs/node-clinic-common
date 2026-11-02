const neostandard = require('neostandard')

module.exports = [
  ...neostandard({
    ignores: ['test/fixtures/**']
  }),
  {
    files: ['**/*.js'],
    rules: {
      '@stylistic/multiline-ternary': 'off'
    }
  }
]
