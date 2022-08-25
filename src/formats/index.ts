import { Dictionary } from 'browser-style-dictionary'
import { objectPaths } from '../utils'
import { treeWalker } from './references'
import { tokenHelpers } from './tokenHelpers'
import { DesignTokensType, DesignTokenType, TokenHelperOptionsType, getFunction } from './types-strings'

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

  result = result + tokenHelpers(true)

  result = result + 'export const $dt = $tokens\n\n'

  return result
}

export const jsFull = ({ tokens }: Dictionary) => {
  const { type } = treeWalker(tokens, false)

  let result = `${getFunction}\n\n`

  result = result + `export const designTokens = ${JSON.stringify(type, null, 2)}\n\n`

  result = result + tokenHelpers(false)

  result = result + 'export const $dt = $tokens\n\n'

  return result
}

/* Not sure if needed anymore
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
*/
