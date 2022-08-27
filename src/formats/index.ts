import { Dictionary } from 'browser-style-dictionary'
import { objectPaths } from '../utils'
import { walkTokens } from './references'
import { tokensHelper } from './tokens-helpers'
import { NuxtDesignTokensType, DesignTokenType, TokenHelperOptionsType, getFunction } from './types-strings'

export { walkTokens }

/**
 * Formats
 */

export const tsTypesDeclaration = ({ tokens }: Dictionary) => {
  const { type } = walkTokens(tokens)

  let result = 'import type { Ref } from \'vue\'\n\n'

  result = 'import { GlobalTokens } from \'@nuxtjs/design-tokens\'\n\n'

  result = result + `export ${DesignTokenType}\n\n`

  result = result + `export ${NuxtDesignTokensType}\n\n`

  result = result + `export ${TokenHelperOptionsType}\n\n`

  result = result + `export interface NuxtThemeTokens extends GlobalTokens ${JSON.stringify(type, null, 2)}\n\n`

  const tokensPaths = objectPaths(type)

  if (tokensPaths.length) {
    result = result + `export type NuxtThemeTokensPaths = ${tokensPaths.map(path => (`'${path}'`)).join(' | \n')}\n\n`
  } else {
    result = result + 'export type NuxtThemeTokensPaths = \'no.tokens\'\n\n'
  }

  result = result.replace(/"DesignToken"/g, 'DesignToken')

  return result
}

export const tsFull = ({ tokens }: Dictionary) => {
  const { type, aliased } = walkTokens(tokens, false)

  let result = 'import type { NuxtThemeTokens,   NuxtThemeTokensPaths, TokenHelperOptions } from \'./types.d\'\n\n'

  result = result + 'export * from \'./types.d\'\n\n'

  result = result + `${getFunction}\n\n`

  result = result + `export const tokensAliases = ${JSON.stringify(aliased, null, 2)} as const\n\n`

  result = result + `export const themeTokens: NuxtThemeTokens = ${JSON.stringify(type, null, 2)}\n\n`

  result = result + tokensHelper(true)

  result = result + 'export const $dt = $tokens\n\n'

  return result
}

export const jsFull = ({ tokens }: Dictionary) => {
  const { type, aliased } = walkTokens(tokens, false)

  let result = `${getFunction}\n\n`

  result = result + `export const tokensAliases = ${JSON.stringify(aliased, null, 2)}\n\n`

  result = result + `export const themeTokens = ${JSON.stringify(type, null, 2)}\n\n`

  result = result + tokensHelper(false)

  result = result + 'export const $dt = $tokens\n\n'

  return result
}
