'use strict'

const path = require('path')
const { test } = require('tap')
const { getLoggingPaths } = require('../')

test('test get logging paths', function (t) {
  const res = getLoggingPaths('foo')
  t.strictEqual(typeof res, 'function')

  const identifierAndPath = res({ identifier: 1062, path: '../bar' })

  t.strictDeepEqual(identifierAndPath, {
    '/': '../bar/1062.clinic-foo',
    '/traceevent': path.join('../bar/1062.clinic-foo', '1062.clinic-foo-traceevent'),
    '/systeminfo': path.join('../bar/1062.clinic-foo', '1062.clinic-foo-systeminfo')
  })

  const identifierZero = res({ identifier: 0, path: '' })

  t.strictDeepEqual(identifierZero, {
    '/': '0.clinic-foo',
    '/traceevent': path.join('0.clinic-foo', '0.clinic-foo-traceevent'),
    '/systeminfo': path.join('0.clinic-foo', '0.clinic-foo-systeminfo')
  })

  t.throws(
    () => res({}),
    /Missing either identifier or path value/
  )

  t.end()
})
