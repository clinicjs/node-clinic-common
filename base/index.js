const button = require('./button.js')
const checkbox = require('./checkbox.js')
const dropdown = require('./drop-down.js')
const helpers = require('./helpers.js')
const ContextOverlay = require('./context-overlay.js')
const Walkthrough = require('./walkthrough-player.js')
const link = require('./link.js')
const walkthroughButton = require('./walkthrough-button.js')
const accordion = require('./accordion.js')
const collapsibleContainer = require('./collapsible-container.js')

/**
 * @typedef {Object} BaseWidgets
 * @property {typeof button} button
 * @property {typeof checkbox} checkbox
 * @property {typeof dropdown} dropdown
 * @property {typeof helpers} helpers
 * @property {typeof ContextOverlay} ContextOverlay
 * @property {typeof Walkthrough} Walkthrough
 * @property {typeof link} link
 * @property {typeof walkthroughButton} walkthroughButton
 * @property {typeof accordion} accordion
 * @property {typeof collapsibleContainer} collapsibleContainer
 */

/** Public base widget exports. @type {BaseWidgets} */
module.exports = {
  button,
  checkbox,
  dropdown,
  helpers,
  ContextOverlay,
  Walkthrough,
  link,
  walkthroughButton,
  accordion,
  collapsibleContainer
}
