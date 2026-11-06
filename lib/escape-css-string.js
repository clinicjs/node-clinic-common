'use strict'

/**
 * Escape a value for insertion inside a quoted CSS string.
 * @param {unknown} value Value converted to a string before escaping.
 * @returns {string} CSS-string-escaped value.
 */
module.exports = value => String(value)
  .replace(/\\/g, '\\\\')
  .replace(/"/g, '\\"')
  .replace(/[\r\n\f]/g, character => `\\${character.charCodeAt(0).toString(16)} `)
