const path = require('path')
const { babel } = require('@rollup/plugin-babel')
const cjs = require('@rollup/plugin-commonjs')
const { nodeResolve } = require('@rollup/plugin-node-resolve')
const replace = require('@rollup/plugin-replace')
const version = require('../package.json').version
const resolve = (_path) => path.resolve(__dirname, '../', _path)

const banner = `/*!
  * vue-swipe v${version}
  * (c) ${new Date().getFullYear()} Terry Zhang
  * @license MIT
  */`

function genConfig(opts) {
  const config = {
    input: {
      input: resolve('src/index.js'),
      external: ['lodash-es'],
      plugins: [
        nodeResolve(),
        cjs(),
        replace({
          __VERSION__: version,
        }),
      ],
    },
    output: {
      file: opts.file,
      format: opts.format,
      banner,
      name: 'VueSwipe',
      globals: {
        'lodash-es': '_',
      },
    },
  }
  if (opts.env) {
    config.input.plugins.unshift(
      replace({
        'process.env.NODE_ENV': JSON.stringify(opts.env),
      })
    )
  }

  if (opts.transpile !== false) {
    config.input.plugins.push(babel({ babelHelpers: 'bundled' }))
  }

  return config
}

module.exports = [
  // browser dev
  {
    file: resolve('dist/vue-swipe.js'),
    format: 'umd',
    env: 'development',
  },
  {
    file: resolve('dist/vue-swipe.min.js'),
    format: 'umd',
    env: 'production',
  },
  {
    file: resolve('dist/vue-swipe.common.js'),
    format: 'cjs',
  },
  {
    file: resolve('dist/vue-swipe.esm.js'),
    format: 'es',
  },
  {
    file: resolve('dist/vue-swipe.esm.browser.js'),
    format: 'es',
    env: 'development',
    transpile: false,
  },
  {
    file: resolve('dist/vue-swipe.esm.browser.min.js'),
    format: 'es',
    env: 'production',
    transpile: false,
  },
].map(genConfig)
