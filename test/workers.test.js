const test = require('tap').test
const workers = require('../lib/workers.js')

function hasWorkerThreads () {
  let hasWorkerThreads = false
  try {
    hasWorkerThreads = !!require('worker_threads')
  } catch (err) {
    // Do nothing
  }
  return hasWorkerThreads
}

test('test worker thread detection', (t) => {
  t.strictEqual(workers.isMainThread, true)
  t.strictEqual(workers.threadId, 0)

  if (hasWorkerThreads()) {
    const { Worker } = require('worker_threads')
    const worker = new Worker(`
const test = require('tap').test
const workers = require('./lib/workers.js')
const assert = require('assert')
assert.strictEqual(workers.isMainThread, false)
assert.strictEqual(workers.threadId, 1)
    `, { eval: true })
    worker.on('exit', (code) => {
      if (code !== 0) t.fail(`worker test failed with code ${code}`)
      t.end()
    })
  } else {
    t.end()
  }
})
