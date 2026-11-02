/** @type {typeof import('node:test')} */
const test = require('node:test')
const renderMain = require('../../templates/main.js')

/** @param {import('node:stream').Readable} stream @returns {Promise<string>} */
async function collect (stream) {
  return new Promise((resolve, reject) => {
    let output = ''
    stream.on('data', /** @param {Buffer|string} chunk */ chunk => { output += chunk })
    stream.on('end', () => resolve(output))
    stream.on('error', reject)
  })
}

test('main template combines common chrome and page content', /** @param {import('node:test').TestContext} t */ async function (t) {
  t.plan(13)
  const html = await collect(renderMain({
    htmlClass: 'page',
    bodyClass: 'report',
    favicon: 'icon.png',
    title: 'Report',
    styles: '.page{}',
    head: '<meta name="custom" content="value">',
    script: 'start()',
    headerLogoUrl: '/clinic',
    headerLogoTitle: 'Clinic home',
    headerLogo: '<svg></svg>',
    headerText: 'Clinic',
    toolVersion: '1.0',
    body: '<main>Results</main>',
    data: '{"ok":true}'
  }))

  t.assert.match(html, /<title>Report<\/title>/)
  t.assert.match(html, /<html lang="en" class="page">/)
  t.assert.match(html, /<body class="report">/)
  t.assert.match(html, /href="icon\.png"/)
  t.assert.match(html, /<style>\.page\{\}<\/style>/)
  t.assert.match(html, /<meta name="custom" content="value">/)
  t.assert.match(html, /<main>Results<\/main>/)
  t.assert.match(html, /id="clinic-data"/)
  t.assert.match(html, /\{"ok":true\}/)
  t.assert.match(html, /start\(\)/)
  t.assert.match(html, /href="\/clinic"/)
  t.assert.match(html, /<svg><\/svg>/)
  t.assert.match(html, /v1\.0/)
})

test('main template omits the data script when no data is given', /** @param {import('node:test').TestContext} t */ async function (t) {
  t.plan(1)
  const html = await collect(renderMain({}))
  t.assert.doesNotMatch(html, /clinic-data/)
})

test('main escapes HTML fields and script terminators in data', /** @param {import('node:test').TestContext} t */ async function (t) {
  t.plan(4)
  const html = await collect(renderMain({
    title: '<img src=x>',
    htmlClass: '" onload="x',
    data: '{"value":"</script><script>bad()</script>"}'
  }))
  t.assert.match(html, /class="&quot; onload=&quot;x"/)
  t.assert.match(html, /<title>&lt;img src=x&gt;<\/title>/)
  t.assert.match(html, /<script type="application\/json" id="clinic-data">\{"value":"\\u003c\/script>/)
  t.assert.doesNotMatch(html, /<script type="application\/json"[^]*?<script>bad\(\)/)
})
