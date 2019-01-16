const browserify = require('browserify')
const brfs = require('brfs')
const envify = require('loose-envify/custom')

const buildJs = ({ basedir, debug, fakeDataPath, scriptPath, beforeBundle, env = {} }) => {
  const b = browserify({
    basedir,
    debug,
    noParse: [fakeDataPath]
  })

  if (beforeBundle) {
    beforeBundle(b)
  }

  return b
    .add(scriptPath)
    .transform(brfs)
    .transform(envify({
      DEBUG_MODE: debug,
      ...env
    }))
    .bundle()
}

module.exports = buildJs
