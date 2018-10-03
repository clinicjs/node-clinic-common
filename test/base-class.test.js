'use strict'

const { test } = require('tap')
const { Tool } = require('../')

test('verify base class options', function (t) {
  t.throws(() => new Tool())
  t.throws(
    () => new Tool({}),
    /The "name" option must be of type string\. Received undefined/
  )
  t.throws(
    () => new Tool({ name: 'foo', customEnvHook: 'foo' }),
    /The "customEnvHook" option must be of type function\. Received string/
  )
  t.end()
})

test('verify base class works as expected', function (t) {
  const tool = new Tool({
    name: 'foo',
    customEnvHook (env) {
      t.deepEqual(env, {
        NODE_OPTIONS: '-r no-cluster.js --trace-events-enabled --trace-event-categories',
        NODE_PATH: '/home/ruben/repos/nearForm/node-clinic/node-clinic-common/lib/injects'
      })
    }
  })
  // Triggering collect is necessary to test the custom env hook.
  // However, this is expected to throw because we do not provide a valid binary path.
  t.throws(() => tool.collect([], () => {}))
  t.end()
})
