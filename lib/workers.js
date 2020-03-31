'use strict'

function maybeWorkerThreads () {
  let isMainThread = true
  let threadId = 0
  try {
    const workerThreads = require('worker_threads')
    isMainThread = workerThreads.isMainThread
    threadId = workerThreads.threadId
  } catch (err) {
    // Do nothing
  }
  return { isMainThread, threadId }
}

module.exports = maybeWorkerThreads()
