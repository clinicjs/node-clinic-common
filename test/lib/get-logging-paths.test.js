const test = require('node:test')
const path = require('path')
const getLoggingPaths = require('../../lib/get-logging-paths.js')

const flameFiles = ['/samples', '/inlinedfunctions', '/0x-data/']

test('logging path - identifier', function (/** @type {import('node:test').TestContext} */ t) {
  t.plan(1)
  const paths = getLoggingPaths('toolname')({ identifier: 1062 })

  t.assert.deepStrictEqual(paths, {
    '/': '1062.clinic-toolname',
    '/systeminfo': path.normalize('1062.clinic-toolname/1062.clinic-toolname-systeminfo')
  })
})

test('logging path - zero identifier', function (/** @type {import('node:test').TestContext} */ t) {
  t.plan(1)
  t.assert.strictEqual(getLoggingPaths('toolname')({ identifier: 0 })['/'], '0.clinic-toolname')
})

test('empty tool-specific file list overrides defaults', function (/** @type {import('node:test').TestContext} */ t) {
  t.plan(1)
  t.assert.deepStrictEqual(Object.keys(getLoggingPaths('doctor', [])({ identifier: 1 })), ['/', '/systeminfo'])
})

test('logging path - path', function (/** @type {import('node:test').TestContext} */ t) {
  t.plan(1)
  const paths = getLoggingPaths('toolname')({ path: path.normalize('/root/1062.clinic-toolname') })

  t.assert.deepStrictEqual(paths, {
    '/': path.normalize('/root/1062.clinic-toolname'),
    '/systeminfo': path.normalize('/root/1062.clinic-toolname/1062.clinic-toolname-systeminfo')
  })
})

test('Collect - logging path - path and identifier', function (/** @type {import('node:test').TestContext} */ t) {
  t.plan(1)
  const paths = getLoggingPaths('doctor')({ path: './foo', identifier: 1062 })

  t.assert.deepStrictEqual(paths, {
    '/': path.join('foo', '1062.clinic-doctor'),
    '/traceevent': path.join('foo', '1062.clinic-doctor', '1062.clinic-doctor-traceevent'),
    '/systeminfo': path.join('foo', '1062.clinic-doctor', '1062.clinic-doctor-systeminfo'),
    '/processstat': path.join('foo', '1062.clinic-doctor', '1062.clinic-doctor-processstat')
  })
})

test('Collect - logging path - null path and identifier', function (/** @type {import('node:test').TestContext} */ t) {
  t.plan(1)
  const paths = getLoggingPaths('doctor')({ path: null, identifier: 1062 })

  t.assert.deepStrictEqual(paths, {
    '/': path.join('', '1062.clinic-doctor'),
    '/traceevent': path.join('', '1062.clinic-doctor', '1062.clinic-doctor-traceevent'),
    '/systeminfo': path.join('', '1062.clinic-doctor', '1062.clinic-doctor-systeminfo'),
    '/processstat': path.join('', '1062.clinic-doctor', '1062.clinic-doctor-processstat')
  })
})

test('logging path - supports 0x path templates', function (/** @type {import('node:test').TestContext} */ t) {
  t.plan(1)
  const paths = getLoggingPaths('flame')({ identifier: '{pid}' })
  t.assert.deepStrictEqual(paths, {
    '/': path.normalize('{pid}.clinic-flame'),
    '/systeminfo': path.normalize('{pid}.clinic-flame/{pid}.clinic-flame-systeminfo')
  })
})

test('logging path - tool-specific files', function (/** @type {import('node:test').TestContext} */ t) {
  t.plan(1)
  const paths = getLoggingPaths('flame', flameFiles)({ identifier: '2261' })
  t.assert.deepStrictEqual(paths, {
    '/': path.normalize('2261.clinic-flame'),
    '/systeminfo': path.normalize('2261.clinic-flame/2261.clinic-flame-systeminfo'),
    '/samples': path.normalize('2261.clinic-flame/2261.clinic-flame-samples'),
    '/inlinedfunctions': path.normalize('2261.clinic-flame/2261.clinic-flame-inlinedfunctions'),
    '/0x-data/': path.normalize('2261.clinic-flame/2261.clinic-flame-0x-data')
  })
})

test('logging path - default paths for doctor', function (/** @type {import('node:test').TestContext} */ t) {
  t.plan(1)
  const paths = getLoggingPaths('doctor')({ identifier: '2261' })
  t.assert.deepStrictEqual(paths, {
    '/': path.normalize('2261.clinic-doctor'),
    '/systeminfo': path.normalize('2261.clinic-doctor/2261.clinic-doctor-systeminfo'),
    '/traceevent': path.normalize('2261.clinic-doctor/2261.clinic-doctor-traceevent'),
    '/processstat': path.normalize('2261.clinic-doctor/2261.clinic-doctor-processstat')
  })
})

test('logging path - default paths for bubbleprof', function (/** @type {import('node:test').TestContext} */ t) {
  t.plan(1)
  const paths = getLoggingPaths('bubbleprof')({ identifier: '2261' })
  t.assert.deepStrictEqual(paths, {
    '/': path.normalize('2261.clinic-bubbleprof'),
    '/systeminfo': path.normalize('2261.clinic-bubbleprof/2261.clinic-bubbleprof-systeminfo'),
    '/traceevent': path.normalize('2261.clinic-bubbleprof/2261.clinic-bubbleprof-traceevent'),
    '/stacktrace': path.normalize('2261.clinic-bubbleprof/2261.clinic-bubbleprof-stacktrace')
  })
})

test('logging paths - null values', function (/** @type {import('node:test').TestContext} */ t) {
  t.plan(3)
  t.assert.throws(
    // @ts-expect-error Deliberately invalid input exercises runtime validation.
    () => getLoggingPaths('toolname')({ identifier: null }),
    new Error('missing either identifier or path value')
  )
  t.assert.throws(
    () => getLoggingPaths('toolname')({ path: null }),
    new Error('missing either identifier or path value')
  )
  t.assert.throws(
    () => getLoggingPaths('toolname')({ path: null, identifier: null }),
    new Error('missing either identifier or path value')
  )
})

test('logging paths - bad type', function (/** @type {import('node:test').TestContext} */ t) {
  t.plan(1)
  t.assert.throws(
    // @ts-expect-error Deliberately invalid input exercises runtime validation.
    () => getLoggingPaths('toolname')({}),
    new Error('missing either identifier or path value')
  )
})
