'use strict'

/**
 * Escape a value for insertion as HTML text or a quoted attribute value.
 * @param {unknown} value Value converted to a string before escaping.
 * @returns {string} HTML-escaped value.
 */
module.exports = value => String(value == null ? '' : value)
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&#39;')
