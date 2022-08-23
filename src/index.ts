import { resolveModule } from '@nuxt/kit'
import jiti from 'jiti'
import { palette } from './palette'
import { compose } from './compose'
import { generateTokens } from './runtime/server/utils'
import type { DesignTokens, DesignTokensPaths, DesignToken } from '#design-tokens/types'

export interface GlobalTokens {
  /**
   * Standard way to define your color palette.
   */
  colors: DesignTokens
  /**
   * Standard screen sizes commonly used.
   */
  screens: {
    '2xs': DesignToken
    xs: DesignToken
    sm: DesignToken
    md: DesignToken
    lg: DesignToken
    xl: DesignToken
    '2xl': DesignToken
    '3xl': DesignToken
  } & DesignTokens
}

export interface NuxtDesignTokens extends DesignTokens, GlobalTokens {
}

export interface NuxtDesignTokensConfig {
  server?: boolean
  tokens?: NuxtDesignTokens | boolean | string
}

export interface ModuleOptions extends NuxtDesignTokensConfig {
  // Module options
}

export interface ModuleHooks {
  // Module hooks
}

export interface ModulePublicRuntimeConfig {
  // Module public config
}

// Non-reactive data taken from initial boot
export interface ModulePrivateRuntimeConfig {
  tokensDir?: string
  server?: boolean
  tokensFilePaths?: Array<string>
}

export type DeepPartial<T> = T extends object ? { [P in keyof T]?: DeepPartial<T[P]>; } : T;

export { generateTokens, palette, compose }

export const defineTokens = (tokens: DeepPartial<NuxtDesignTokens>): DeepPartial<NuxtDesignTokens> => tokens

export const $tokens = (path: DesignTokensPaths,
  {
    key = 'variable',
    flatten = true
  }:
  {
    key?: keyof DesignToken,
    flatten?: boolean
  }
) => {
  const module = resolveModule(`${globalThis.__nuxtDesignTokensBuildDir__}index.ts`)

  const { $dt } = jiti(import.meta.url, { cache: false, requireCache: false, v8cache: false })(module)

  const fail = () => {
    const _key = key ? `.${key as string}` : ''
    // eslint-disable-next-line no-console
    console.log(`Could not find the token ${path}${_key}!`)
  }

  return $dt(path, key, flatten) || fail()
}

export const $dt = $tokens

declare module '@nuxt/schema' {
  interface PublicRuntimeConfig {
    // @ts-ignore
    designTokens?: ModulePublicRuntimeConfig;
  }

  interface RuntimeConfig {
    // @ts-ignore
    designTokens?: ModulePrivateRuntimeConfig;
  }

  interface NuxtConfig {
    // @ts-ignore
    designTokens?: Partial<ModuleOptions>
  }

  interface NuxtOptions {
    // @ts-ignore
    designTokens?: ModuleOptions
  }
}
