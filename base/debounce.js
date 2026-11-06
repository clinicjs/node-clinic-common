/**
 * Defer a function until it has not been called for the given interval.
 * @template {(...args: never[]) => unknown} F
 * @param {F} func
 * @param {number} wait Delay in milliseconds.
 * @returns {(this: ThisParameterType<F>, ...args: Parameters<F>) => void}
 */
module.exports = function debounce (func, wait) {
  /** @type {ReturnType<typeof setTimeout> | undefined} */
  let timeout

  /** @this {ThisParameterType<F>} */
  return function (...args) {
    const context = this
    clearTimeout(timeout)
    timeout = setTimeout(() => func.apply(context, args), wait)
  }
}
