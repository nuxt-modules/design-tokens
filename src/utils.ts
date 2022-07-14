import { mkdir } from 'fs/promises'
import { existsSync } from 'fs'
import { defu } from 'defu'
import { resolve } from 'pathe'
import chalk from 'chalk'
import { requireModule, useLogger } from '@nuxt/kit'
import { name, version } from '../package.json'
import type { NuxtDesignTokens, ModuleOptions } from './index'

export interface NuxtLayer {
  config: any
  configFile: string
  cwd: string
}

// Default options
export const MODULE_DEFAULTS: ModuleOptions = {
  tokens: true
}

// Logging
export const logger = useLogger('design-tokens')
export const pkgName = chalk.magentaBright(name)

// Package datas
export { name, version }

export const resolveConfig = (layer: NuxtLayer, key: string, configFile = `${key}.config`) => {
  const value = layer.config?.designTokens?.[key] || MODULE_DEFAULTS[key]
  let config = {}

  let filePath: string

  if (typeof value === 'boolean') {
    filePath = resolve(layer.cwd, configFile)
  } else if (typeof value === 'string') {
    filePath = resolve(layer.cwd, value)
  } else if (typeof value === 'object') {
    config = value
  }

  if (filePath) {
    try {
      const _file = requireModule(filePath, { clearCache: true })
      if (_file) { config = _file }
    } catch (_) {}
  }

  return { filePath, config }
}

/**
 * Resolve `tokens` config layers from `extends` layers and merge them via `defu()`.
 */
export const resolveTokens = (layers: NuxtLayer[]) => {
  const tokensFilePaths: string[] = []
  let tokens = {} as NuxtDesignTokens

  const splitLayer = (layer: NuxtLayer) => {
    // Deeply merge tokens
    // In opposition to defaults, here arrays should also be merged.
    if (layer.config?.designTokens?.tokens || MODULE_DEFAULTS.tokens) {
      const { config: layerTokens, filePath: _layerTokensFilePath } = resolveConfig(layer, 'tokens', 'tokens.config')

      if (_layerTokensFilePath) { tokensFilePaths.push(_layerTokensFilePath) }

      tokens = defu(tokens, layerTokens)
    }
  }

  for (const layer of layers) { splitLayer(layer) }

  return { tokensFilePaths, tokens }
}

export const createTokensDir = async (path: string) => {
  if (!existsSync(path)) { await mkdir(path, { recursive: true }) }
}

/**
 * Make a list of `get()` compatible paths for any object
 */
export const objectPaths = (data: any) => {
  const output: any = []
  function step (obj: any, prev?: string) {
    Object.keys(obj).forEach((key) => {
      const value = obj[key]
      const isarray = Array.isArray(value)
      const type = Object.prototype.toString.call(value)
      const isobject =
        type === '[object Object]' ||
        type === '[object Array]'

      const newKey = prev
        ? `${prev}.${key}`
        : key

      if (!output.includes(newKey)) { output.push(newKey) }

      if (!isarray && isobject && Object.keys(value).length) { return step(value, newKey) }
    })
  }
  step(data)
  return output
}
