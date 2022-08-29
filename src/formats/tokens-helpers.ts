export const tokensHelper = (ts: boolean = false) => {
  return `const defaultTokensHelperOptions${ts ? ': TokensHelperOptions' : ''} = {
  key: 'variable',
  flatten: true,
  silent: false
}

/**
 * Get a theme token by its path
 */
export const $tokens = (path${ts ? ': NuxtThemeTokensPaths' : ''} = undefined, options${ts ? ': TokensHelperOptions' : ''} = {}) => {
  const { key, flatten } = Object.assign(defaultTokensHelperOptions, options)

  if (!path) return themeTokens

  if (key === 'variable' && tokensAliases[path]) {
    return tokensAliases[path]
  }

  const token = get(themeTokens, path)

  if (key && token?.[key]) { return token[key] }

  if (key && flatten && typeof token === 'object') {
    const flattened = {}
    
    const flattenTokens = (obj) => {
      Object.entries(obj).forEach(([objectKey, value]) => {
        if (value[key]) {
          flattened[objectKey] = value[key]
          return
        }

        flattenTokens(value)
      })
    }

    flattenTokens(token)

    return flattened
  }

  return token
}\n\n`
}
