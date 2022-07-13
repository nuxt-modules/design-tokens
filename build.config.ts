import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  stub: false,
  entries: [
    {
      input: './src/index.ts',
      builder: 'rollup',
      name: 'index'
    }
  ],
  externals: [
    '#design-tokens',
    'browser-style-dictionary',
    'ufo',
    'jiti',
    'pathe',
    'defu',
    'chalk',
    'ansi-styles',
    'supports-color',
    'has-flag',
    'color-convert',
    'color-name'
  ]
})
