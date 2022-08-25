import { Dictionary } from 'browser-style-dictionary'
import { kebabCase } from 'scule'
import { get, objectPaths } from './utils'
import { DesignTokensPaths } from '#design-tokens/types'

// browser-style-dictionary/lib/utils/references/createReferenceRegex
const referenceRegexDefaults = {
  opening_character: '{',
  closing_character: '}',
  separator: '.'
}
function createReferenceRegex (opts = {}) {
  const options = Object.assign({}, referenceRegexDefaults, opts)

  return new RegExp(
    '\\' +
    options.opening_character +
    '([^' +
    options.closing_character +
    ']+)' +
    '\\' +
    options.closing_character, 'g'
  )
}

const resolveVariableFromPath = (path: DesignTokensPaths): string => `var(--${path.split('.').map(key => kebabCase(key)).join('-')})`

const DesignTokenType =
`interface DesignToken<T = string | number> {
  /* The raw value you specified in your token declaration. */
  value?: T;
  /* CSS Variable reference that gets generated. */
  variable?: string;
  name?: string;
  comment?: string;
  themeable?: boolean;
  property?: string;
  /* Is the property using compose() */
  composed?: boolean;
  /* Is the property using palette() */
  palette?: boolean
  /* Is the property nested in a selector */
  nested?: string;
  /* Is the property nested in variant */
  variant?: string;
  attributes?: {
    category?: string;
    type?: string;
    item?: string;
    subitem?: string;
    state?: string;
    [key: string]: any;
  };
  [key: string]: any;
}`

const DesignTokensType =
`interface DesignTokens {
  [key: string]: DesignTokens | DesignToken;
}`

const TokenHelperOptionsType =
`interface TokenHelperOptions {
  /**
   * The key that will be unwrapped from the design token object.
   * @default variable
   */
  key?: string
  /**
   * Toggle logging if requesting an unknown token.
   * @default false
   */
  silent?: boolean
  /**
   * Toggle deep flattening of the design token object to the requested key.
   *
   * If you query an token path containing mutliple design tokens and want a flat \`key: value\` object, this option will help you do that.
   */
  flatten?: boolean
}`

const getFunction = `const get = ${get.toString()}`

export const treeWalker = (obj, typing: boolean = true, aliased = {}) => {
  let type = {}

  if (obj.value) {
    const _path = obj.path.join('.')

    // Resolve aliased properties
    const refRegex = createReferenceRegex({})
    const keyRegex = /{(.*)}/g
    const testOriginal = obj.original.value.match(refRegex)
    if (testOriginal?.[0] && testOriginal[0] === obj.original.value) {
      obj.value = (obj.original.value as string).replace(keyRegex, (_, tokenPath) => {
        aliased[_path] = resolveVariableFromPath(tokenPath)
        return aliased[_path]
      })
    }

    // Transform name to CSS variable name
    obj.variable = aliased?.[_path] ? aliased[_path] : `var(--${obj.name})`

    // Toggle between type declaration and value
    type = typing ? 'DesignToken' : obj
  } else {
    for (const k in obj) {
      if (obj[k] && typeof obj[k] === 'object') {
        type[k] = treeWalker(obj[k], typing, aliased).type
      }
    }
  }

  return { type, aliased }
}

/**
 * Formats
 */

export const tsTypesDeclaration = ({ tokens }: Dictionary) => {
  const { type } = treeWalker(tokens)

  let result = 'import type { Ref } from \'vue\'\n\n'

  result = result + `export ${DesignTokenType}\n\n`

  result = result + `export ${DesignTokensType}\n\n`

  result = result + `export ${TokenHelperOptionsType}\n\n`

  result = result + `export interface NuxtDesignTokens extends DesignTokens ${JSON.stringify(type, null, 2)}\n\n`

  const tokensPaths = objectPaths(type)

  if (tokensPaths.length) {
    result = result + `export type DesignTokensPaths = ${tokensPaths.map(path => (`'${path}'`)).join(' | \n')}\n\n`
  } else {
    result = result + 'export type DesignTokensPaths = \'no.tokens\'\n\n'
  }

  result = result.replace(/"DesignToken"/g, 'DesignToken')

  return result
}

export const tsFull = ({ tokens }: Dictionary) => {
  const { type, aliased } = treeWalker(tokens, false)

  let result = 'import type { NuxtDesignTokens, DesignTokensPaths, DesignToken, TokenHelperOptions } from \'./types.d\'\n\n'

  result = result + 'export * from \'./types.d\'\n\n'

  result = result + `${getFunction}\n\n`

  result = result + `export const tokenAliases = ${JSON.stringify(aliased, null, 2)} as const\n\n`

  result = result + `export const designTokens: NuxtDesignTokens = ${JSON.stringify(type, null, 2)}\n\n`

  result = result +
`const defaultTokenHelperOptions: TokenHelperOptions = {
  key: 'variable',
  flatten: true,
  silent: false
}

/**
 * Get a theme token by its path
 */
export const $tokens = (path: DesignTokensPaths = undefined, options: TokenHelperOptions = {}) => {
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

  result = result + 'export const $dt = $tokens\n\n'

  return result
}

export const jsFull = ({ tokens }: Dictionary) => {
  const { type } = treeWalker(tokens, false)

  let result = `${getFunction}\n\n`

  result = result + `export const designTokens = ${JSON.stringify(type, null, 2)}\n\n`

  result = result +
`const defaultTokenHelperOptions = {
  key: 'variable',
  flatten: true,
  silent: false
}

/**
 * Get a theme token by its path
 * @typedef {import('types').DesignTokensPaths} DesignTokensPaths
 * @typedef {import('types').DesignToken} DesignToken
 * * @typedef {import('types').TokenHelperOptions} TokenHelperOptions
 * @param {DesignTokensPaths} path The path to the theme token
 * @param {TokenHelperOptions} options Optional options
 */
export const $tokens = (path = undefined, options = {}) => {
  const { key, flatten } = Object.assign(defaultTokenHelperOptions, options)

  if (!path) return designTokens

  if (key === 'variable' && tokenAliases[path]) {
    return tokenAliases[path]
  }

  const token = get(designTokens, path)

  if (key && token?.[key]) { return token[key] }

  if (key && flatten && typeof token === 'object') {
    const flattened = {}
    
    const flatten = (obj) => {
      Object.entries(obj).forEach(([objectKey, value]) => {
        if (value[key]) {
          flattened[objectKey] = value[key]
          return
        }

        flatten(value)
      })
    }

    flatten(token)

    return flattened
  }

  return token
}\n\n`

  result = result + 'export const $dt = $tokens\n\n'

  return result
}

export const nuxtPlugin = ({ tokens }: Dictionary) => {
  const { aliased } = treeWalker(tokens, false)

  return `import type { Ref } from 'vue'
  import { kebabCase } from 'scule'
  import type { DesignTokensPaths } from '#design-tokens/types'
  import { defineNuxtPlugin, unref } from '#imports'
  
  export const tokenAliases = ${JSON.stringify(aliased, null, 2)}

  export default defineNuxtPlugin(() => {
    const resolveVariableFromPath = (path: DesignTokensPaths | Ref<DesignTokensPaths>): string => {
      if (tokenAliases[path]) { return tokenAliases[path] }
      return \`var(--\${unref(path).split('.').map(key => kebabCase(key)).join('-')})\`
    }
  
    return {
      provide: {
        tokens: resolveVariableFromPath,
        dt: resolveVariableFromPath
      }
    }
  })`
}
