const DesignTokenType =
`interface DesignToken {
  /* The raw value you specified in your token declaration. */
  value: any;
  /* CSS Variable reference that gets generated. */
  variable: string;
  name?: string;
  comment?: string;
  themeable?: boolean;
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

const getFunction =
`const get = (obj, path, defValue) => {
  if (!path) return undefined
  const pathArray = Array.isArray(path) ? path : path.match(/([^[.\\]])+/g)
  const result = pathArray.reduce(
    (prevObj, key) => prevObj && prevObj[key],
    obj
  )
  return result === undefined ? defValue : result
}`

export const treeWalker = (obj, typing: boolean = true) => {
  let type = Object.create(null)

  const has = Object.prototype.hasOwnProperty.bind(obj)

  if (has('value')) {
    // Transform name to CSS variable name
    obj.variable = `var(--${obj.name})`

    // Toggle between type declaration and value
    type = typing ? 'DesignToken' : obj
  } else {
    for (const k in obj) {
      if (has(k)) {
        switch (typeof obj[k]) {
          case 'object':
            type[k] = treeWalker(obj[k], typing)
        }
      }
    }
  }

  return type
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

/**
 * Formats
 */

export const tsTypesDeclaration = ({ tokens }) => {
  const tokensObject = treeWalker(tokens)

  let result = 'import type { Ref } from \'vue\'\n\n'

  result = result + `export ${DesignTokenType}\n\n`

  result = result + `export ${DesignTokensType}\n\n`

  result = result + `export interface NuxtDesignTokens extends DesignTokens ${JSON.stringify(tokensObject, null, 2)}\n\n`

  const tokensPaths = objectPaths(tokensObject)

  if (tokensPaths.length) {
    result = result + `export type DesignTokensPaths = ${tokensPaths.map(path => (`'${path}'`)).join(' | \n')}\n\n`
  } else {
    result = result + 'export type DesignTokensPaths = \'no.tokens\'\n\n'
  }

  result = result.replace(/"DesignToken"/g, 'DesignToken')

  return result
}

export const tsFull = ({ tokens }) => {
  let result = 'import type { NuxtDesignTokens, DesignTokensPaths, DesignToken } from \'./types.d\'\n\n'

  result = result + 'export * from \'./types.d\'\n\n'

  result = result + `${getFunction}\n\n`

  result = result + `export const designTokens: NuxtDesignTokens = ${JSON.stringify(treeWalker(tokens, false), null, 2)}\n`

  result = result + `\n
/**
 * Get a theme token by its path
 */
export const $tokens = (path: DesignTokensPaths, key: keyof DesignToken = 'variable', flatten: boolean = true) => {
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

export const jsFull = ({ tokens }) => {
  let result = `${getFunction}\n\n`

  result = result + `export const designTokens = ${JSON.stringify(treeWalker(tokens, false), null, 2)}\n`

  result = result +
`\n
/**
 * Get a theme token by its path
 * @typedef {import('tokens-types').DesignTokensPaths} DesignTokensPaths
 * @typedef {import('tokens-types').DesignToken} DesignToken
 * @param {DesignTokensPaths} path The path to the theme token
 * @param {keyof DesignToken} variable Returns the variable if exists if true
 * @param {boolean} flatten If the path gives an object, returns a deeply flattened object with "key" used as values.
 */
export const $tokens = (path, key = 'variable', flatten: boolean = true) => {
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

  result = result + 'export const $to = $tokens\n\n'

  return result
}
