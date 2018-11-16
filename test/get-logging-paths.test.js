const test = require('tap').test
const path = require('path')
const getLoggingPaths = require('../lib/get-logging-paths.js')

const flameFiles = ['/samples', '/inlinedfunctions', '/0x-data/']

test('logging path - identifier', function (t) {
  const paths = getLoggingPaths('toolname')({ identifier: 1062 })

  t.strictDeepEqual(paths, {
    '/': '1062.clinic-toolname',
    '/systeminfo': path.normalize('1062.clinic-toolname/1062.clinic-toolname-systeminfo')
  })
  t.end()
})

test('logging path - path', function (t) {
  const paths = getLoggingPaths('toolname')({ path: path.normalize('/root/1062.clinic-toolname') })

  t.strictDeepEqual(paths, {
    '/': path.normalize('/root/1062.clinic-toolname'),
    '/systeminfo': path.normalize('/root/1062.clinic-toolname/1062.clinic-toolname-systeminfo')
  })
  t.end()
})

test('Collect - logging path - path and identifier', function (t) {
  const paths = getLoggingPaths('doctor')({ path: './foo', identifier: 1062 })

  t.strictDeepEqual(paths, {
    '/': path.join('foo', '1062.clinic-doctor'),
    '/traceevent': path.join('foo', '1062.clinic-doctor', '1062.clinic-doctor-traceevent'),
    '/systeminfo': path.join('foo', '1062.clinic-doctor', '1062.clinic-doctor-systeminfo'),
    '/processstat': path.join('foo', '1062.clinic-doctor', '1062.clinic-doctor-processstat')
  })
  t.end()
})

test('Collect - logging path - null path and identifier', function (t) {
  const paths = getLoggingPaths('doctor')({ path: null, identifier: 1062 })

  t.strictDeepEqual(paths, {
    '/': path.join('', '1062.clinic-doctor'),
    '/traceevent': path.join('', '1062.clinic-doctor', '1062.clinic-doctor-traceevent'),
    '/systeminfo': path.join('', '1062.clinic-doctor', '1062.clinic-doctor-systeminfo'),
    '/processstat': path.join('', '1062.clinic-doctor', '1062.clinic-doctor-processstat')
  })
  t.end()
})

test('logging path - supports 0x path templates', function (t) {
  const paths = getLoggingPaths('flame')({ identifier: '{pid}' })
  t.strictDeepEqual(paths, {
    '/': path.normalize('{pid}.clinic-flame'),
    '/systeminfo': path.normalize('{pid}.clinic-flame/{pid}.clinic-flame-systeminfo')
  })
  t.end()
})

test('logging path - tool-specific files', function (t) {
  const paths = getLoggingPaths('flame', flameFiles)({ identifier: '2261' })
  t.strictDeepEqual(paths, {
    '/': path.normalize('2261.clinic-flame'),
    '/systeminfo': path.normalize('2261.clinic-flame/2261.clinic-flame-systeminfo'),
    '/samples': path.normalize('2261.clinic-flame/2261.clinic-flame-samples'),
    '/inlinedfunctions': path.normalize('2261.clinic-flame/2261.clinic-flame-inlinedfunctions'),
    '/0x-data/': path.normalize('2261.clinic-flame/2261.clinic-flame-0x-data')
  })
  t.end()
})

test('logging path - default paths for doctor', function (t) {
  const paths = getLoggingPaths('doctor')({ identifier: '2261' })
  t.strictDeepEqual(paths, {
    '/': path.normalize('2261.clinic-doctor'),
    '/systeminfo': path.normalize('2261.clinic-doctor/2261.clinic-doctor-systeminfo'),
    '/traceevent': path.normalize('2261.clinic-doctor/2261.clinic-doctor-traceevent'),
    '/processstat': path.normalize('2261.clinic-doctor/2261.clinic-doctor-processstat')
  })
  t.end()
})

test('logging path - default paths for bubbleprof', function (t) {
  const paths = getLoggingPaths('bubbleprof')({ identifier: '2261' })
  t.strictDeepEqual(paths, {
    '/': path.normalize('2261.clinic-bubbleprof'),
    '/systeminfo': path.normalize('2261.clinic-bubbleprof/2261.clinic-bubbleprof-systeminfo'),
    '/traceevent': path.normalize('2261.clinic-bubbleprof/2261.clinic-bubbleprof-traceevent'),
    '/stacktrace': path.normalize('2261.clinic-bubbleprof/2261.clinic-bubbleprof-stacktrace')
  })
  t.end()
})

test('logging paths - null values', function (t) {
  t.throws(
    () => getLoggingPaths('toolname')({ identifier: null }),
    new Error('missing either identifier or path value')
  )
  t.throws(
    () => getLoggingPaths('toolname')({ path: null }),
    new Error('missing either identifier or path value')
  )
  t.throws(
    () => getLoggingPaths('toolname')({ path: null, identifier: null }),
    new Error('missing either identifier or path value')
  )
  t.end()
})

test('logging paths - bad type', function (t) {
  t.throws(
    () => getLoggingPaths('toolname')({}),
    new Error('missing either identifier or path value')
  )
  t.end()
})
