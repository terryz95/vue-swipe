const fs = require('fs')
const path = require('path')
const zlib = require('zlib')
const terser = require('terser')
const rollup = require('rollup')
const configs = require('./configs')

if (!fs.existsSync('dist')) {
  fs.mkdirSync('dist')
}

build(configs)

function build(builds) {
  let build = 0
  const total = builds.length
  const next = () => {
    buildEntry(builds[build])
      .then(() => {
        build++
        if (build < total) {
          next()
        }
      })
      .catch((e) => console.error(e))
  }

  next()
}

function buildEntry({ input, output }) {
  const { file } = output
  const isProd = /min\.js$/.test(file)
  return rollup
    .rollup(input)
    .then((bundle) => bundle.generate(output))
    .then(async (bundle) => {
      const code = bundle.output[0].code
      if (isProd) {
        const { code: minified } = await terser.minify(code, { toplevel: true })
        return write(file, minified, true)
      } else {
        return write(file, code)
      }
    })
}

function write(dest, code, zip) {
  return new Promise((resolve, reject) => {
    function report(extra) {
      console.log(
        blue(path.relative(process.cwd(), dest)) +
          ' ' +
          getSize(code) +
          (extra || '')
      )
      resolve()
    }

    fs.writeFile(dest, code, (err) => {
      if (err) return reject(err)
      if (zip) {
        zlib.gzip(code, (err, zipped) => {
          if (err) return reject(err)
          report(' (gzipped: ' + getSize(zipped) + ')')
        })
      } else {
        report()
      }
    })
  })
}

function getSize(code) {
  return (code.length / 1024).toFixed(2) + 'kb'
}

function blue(str) {
  return '\x1b[1m\x1b[34m' + str + '\x1b[39m\x1b[22m'
}
