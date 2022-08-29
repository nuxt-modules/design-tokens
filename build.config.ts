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
    // ??
    'formats.mjs',
    'generate.mjs',
    // ??
    '@vue/compiler-sfc',
    'magic-string',
    'json5',
    'recast',
    'scule',
    'unplugin',
    '#design-tokens',
    'browser-style-dictionary',
    'consola',
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
