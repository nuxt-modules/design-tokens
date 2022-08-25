export const tokenHelpers = (ts: boolean = false) => {
  return `const defaultTokenHelperOptions${ts ? ': TokenHelperOptions' : ''} = {
  key: 'variable',
  flatten: true,
  silent: false
}

/**
 * Get a theme token by its path
 */
export const $tokens = (path${ts ? ': DesignTokensPaths' : ''} = undefined, options${ts ? ': TokenHelperOptions' : ''} = {}) => {
  const { key, flatten } = Object.assign(defaultTokenHelperOptions, options)

  if (!path) return designTokens

  if (key === 'variable' && tokenAliases[path]) {
    return tokenAliases[path]
  }

  const token = get(designTokens, path)

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
