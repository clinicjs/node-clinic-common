/** @type {typeof import('node:test')} */
const test = require('node:test')
const renderHeader = require('../../templates/header.js')

/** @param {import('node:stream').Readable} stream @returns {Promise<string>} */
async function collect (stream) {
  return new Promise((resolve, reject) => {
    let output = ''
    stream.on('data', /** @param {Buffer|string} chunk */ chunk => { output += chunk })
    stream.on('end', () => resolve(output))
    stream.on('error', reject)
  })
}

test('header includes provided branding and elapsed time', /** @param {import('node:test').TestContext} t */ async function (t) {
  t.plan(8)
  const html = await collect(renderHeader({
    headerLogoUrl: '/home',
    headerLogoTitle: 'Home',
    headerLogo: '<svg></svg>',
    headerText: 'Clinic',
    toolVersion: '2.0',
    elapsedTime: '4s'
  }))

  t.assert.match(html, /href="\/home"/)
  t.assert.match(html, /title="Home"/)
  t.assert.match(html, /<svg><\/svg>/)
  t.assert.match(html, /Clinic/)
  t.assert.match(html, /v2\.0/)
  t.assert.match(html, /target="_blank"/)
  t.assert.match(html, /rel="noopener noreferrer"/)
  t.assert.match(html, /Elapsed Time: <strong>4s<\/strong>/)
})

test('header omits elapsed time when not provided', /** @param {import('node:test').TestContext} t */ async function (t) {
  t.plan(1)
  const html = await collect(renderHeader())
  t.assert.doesNotMatch(html, /Elapsed Time:/)
})

test('header escapes text and attribute values', /** @param {import('node:test').TestContext} t */ async function (t) {
  t.plan(2)
  const html = await collect(renderHeader({
    headerLogoUrl: '" onmouseover="alert(1)',
    headerText: '<img src=x>',
    toolVersion: '&1',
    elapsedTime: "it's <now>"
  }))
  t.assert.match(html, /href="&quot; onmouseover=&quot;alert\(1\)"/)
  t.assert.match(html, /&lt;img src=x&gt;.*v&amp;1/s)
})
