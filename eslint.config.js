const neostandard = require('neostandard')

/** @type {import('eslint').Linter.Config[]} */
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
