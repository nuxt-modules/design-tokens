import { mkdir } from 'fs/promises'
import { existsSync } from 'fs'
import { requireModule } from '@nuxt/kit'
import { resolve } from 'pathe'
import { defu } from 'defu'
import { MODULE_DEFAULTS, NuxtLayer } from './utils'
import type { NuxtDesignTokens } from './index'

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
export const resolveConfigTokens = (layers: NuxtLayer[]) => {
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
  if (!existsSync(path)) {
    await mkdir(path, { recursive: true })
  }
}
