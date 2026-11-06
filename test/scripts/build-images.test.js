/** @type {typeof import('node:test')} */
const test = require('node:test')
const fs = require('fs')
const os = require('os')
const path = require('path')
const buildImages = require('../../scripts/build-images.js')

test('buildImages exports supported formats with matching MIME types', async function (/** @type {import('node:test').TestContext} */ t) {
  t.plan(7)
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'clinic-images-'))
  t.after(() => fs.rmSync(root, { recursive: true, force: true }))
  const sourceDir = path.join(root, 'source')
  const exportDir = path.join(root, 'output')
  fs.mkdirSync(sourceDir)
  fs.mkdirSync(exportDir)
  fs.writeFileSync(path.join(sourceDir, 'one.png'), Buffer.from('one'))
  fs.writeFileSync(path.join(sourceDir, 'two.jpeg'), Buffer.from('two'))
  fs.writeFileSync(path.join(sourceDir, 'two-jpg.jpg'), Buffer.from('two-jpg'))
  fs.writeFileSync(path.join(sourceDir, 'three.GIF'), Buffer.from('three'))
  fs.writeFileSync(path.join(sourceDir, 'skip.txt'), 'skip')
  fs.writeFileSync(path.join(sourceDir, 'false-positive.png.txt'), 'skip')
  fs.mkdirSync(path.join(sourceDir, 'nested.png'))

  const originalLog = console.log
  t.after(() => { console.log = originalLog })
  console.log = () => {}
  buildImages.file(path.join(sourceDir, 'one.png'), exportDir)
  t.assert.match(fs.readFileSync(path.join(exportDir, 'one.js'), 'utf8'), /data:image\/png;base64, b25l/)

  await buildImages.path(sourceDir, exportDir)

  t.assert.match(fs.readFileSync(path.join(exportDir, 'two.js'), 'utf8'), /data:image\/jpeg;base64, dHdv/)
  t.assert.match(fs.readFileSync(path.join(exportDir, 'two-jpg.js'), 'utf8'), /data:image\/jpeg;base64, dHdvLWpwZw==/)
  t.assert.match(fs.readFileSync(path.join(exportDir, 'three.js'), 'utf8'), /data:image\/gif;base64, dGhyZWU=/)
  t.assert.ok(!fs.existsSync(path.join(exportDir, 'skip.js')))
  t.assert.ok(!fs.existsSync(path.join(exportDir, 'false-positive.png.js')))
  t.assert.ok(!fs.existsSync(path.join(exportDir, 'nested.js')))
})

test('buildImages rejects a missing source directory', async function (/** @type {import('node:test').TestContext} */ t) {
  t.plan(1)
  await t.assert.rejects(
    buildImages.path(path.join(os.tmpdir(), `missing-clinic-images-${process.pid}-${Date.now()}`), os.tmpdir()),
    { code: 'ENOENT' }
  )
})

test('buildImages rejects unsupported file formats', function (/** @type {import('node:test').TestContext} */ t) {
  t.plan(2)
  t.assert.throws(() => buildImages.file('/tmp/unsupported.txt', '/tmp'), /Unsupported image format/)
  t.assert.throws(() => buildImages.file('/tmp/unsupported', '/tmp'), /\(none\)/)
})

test('buildImages accepts a directory with no supported images', async function (/** @type {import('node:test').TestContext} */ t) {
  t.plan(1)
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'clinic-images-empty-'))
  t.after(() => fs.rmSync(root, { recursive: true, force: true }))
  const sourceDir = path.join(root, 'source')
  const exportDir = path.join(root, 'output')
  fs.mkdirSync(sourceDir)
  fs.mkdirSync(exportDir)
  fs.writeFileSync(path.join(sourceDir, 'notes.txt'), 'no images')

  await buildImages.path(sourceDir, exportDir)
  t.assert.deepStrictEqual(fs.readdirSync(exportDir), [])
})
