import { existsSync } from 'fs'
import { rm, writeFile } from 'fs/promises'
import type { Core as Instance } from 'browser-style-dictionary/types/browser'
import StyleDictionary from 'browser-style-dictionary/browser.js'
import { tsTypesDeclaration, tsFull, jsFull } from './formats'
import { createTokensDir } from './utils'
import type { NuxtDesignTokens } from './index'

export const stubTokens = async (buildPath: string, force = false) => {
  const files = {
    'tokens.css': () => '/* This file is empty because no tokens has been provided. */',
    'tokens.scss': () => '/* This file is empty because no tokens has been provided. */',
    'tokens.json': () => '{}',
    'index.js': jsFull,
    'index.ts': tsFull,
    'types.d.ts': tsTypesDeclaration
  }

  for (const [file, stubbingFunction] of Object.entries(files)) {
    const path = `${buildPath}${file}`

    if (force && existsSync(path)) { await rm(path) }

    if (!existsSync(path)) { await writeFile(path, stubbingFunction ? stubbingFunction({ tokens: {} }) : '') }
  }
}

export const generateTokens = async (
  tokens: NuxtDesignTokens,
  buildPath: string,
  silent = true
) => {
  // Check for tokens directory existence; it might get cleaned-up from `.nuxt`
  if (!existsSync(buildPath)) { await createTokensDir(buildPath) }

  // Stub tokens if no tokens provided
  if (!tokens || !Object.keys(tokens).length) {
    await stubTokens(buildPath, true)
    return
  }

  let styleDictionary: Instance = StyleDictionary

  styleDictionary.fileHeader = {}

  styleDictionary.registerTransformGroup({
    name: 'tokens-js',
    transforms: ['name/cti/kebab', 'size/px', 'color/hex']
  })

  styleDictionary.registerFormat({
    name: 'typescript/types-declaration',
    formatter ({ dictionary }) {
      return tsTypesDeclaration(dictionary)
    }
  })

  styleDictionary.registerFormat({
    name: 'typescript/full',
    formatter ({ dictionary }) {
      return tsFull(dictionary)
    }
  })

  styleDictionary.registerFormat({
    name: 'javascript/full',
    formatter ({ dictionary }) {
      return jsFull(dictionary)
    }
  })

  styleDictionary = await styleDictionary.extend({
    tokens,
    platforms: {
      scss: {
        transformGroup: 'tokens-js',
        buildPath,
        files: [
          {
            destination: 'tokens.scss',
            format: 'scss/variables'
          }
        ]
      },

      json: {
        transformGroup: 'tokens-js',
        buildPath,
        files: [
          {
            destination: 'tokens.json',
            format: 'json/flat'
          }
        ]
      },

      ts: {
        transformGroup: 'tokens-js',
        buildPath,
        files: [
          {
            destination: 'index.ts',
            format: 'typescript/full'
          },
          {
            destination: 'types.d.ts',
            format: 'typescript/types-declaration'
          }
        ]
      },

      js: {
        transformGroup: 'tokens-js',
        buildPath,
        files: [
          {
            destination: 'index.js',
            format: 'javascript/full'
          }
        ]
      },

      css: {
        transformGroup: 'tokens-js',
        buildPath,
        files: [
          {
            destination: 'tokens.css',
            format: 'css/variables'
          }
        ]
      }
    }
  })

  // Weird trick to disable nasty logging
  if (silent) {
    // @ts-ignore
    // eslint-disable-next-line no-console
    console._log = console.log
    // eslint-disable-next-line no-console
    console.log = () => {}
  }

  styleDictionary.cleanAllPlatforms()

  await new Promise(resolve => setTimeout(resolve, 10))

  styleDictionary.buildAllPlatforms()

  await new Promise(resolve => setTimeout(resolve, 10))

  // Weird trick to disable nasty logging
  if (silent) {
    // @ts-ignore
    // eslint-disable-next-line no-console
    console.log = console._log
  }
}
