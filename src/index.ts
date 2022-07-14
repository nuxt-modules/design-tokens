import { resolveModule } from '@nuxt/kit'
import type { DesignTokens } from 'browser-style-dictionary/types/browser'
import jiti from 'jiti'
import palette from './palette'
import { generateTokens } from './runtime/server/utils'
// @ts-ignore
import type { ThemeTokens, DesignTokensPaths, DesignToken } from '#design-tokens/types'

export interface NuxtDesignTokens extends ThemeTokens, DesignTokens {
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

type DeepPartial<T> = T extends object ? { [P in keyof T]?: DeepPartial<T[P]>; } : T;

export { generateTokens, palette }

export const defineTokens = (tokens: DeepPartial<NuxtDesignTokens>): DeepPartial<NuxtDesignTokens> => tokens

export const $tokens = (path: DesignTokensPaths, key: keyof DesignToken = 'variable', flatten: boolean = true) => {
  const module = resolveModule(`${globalThis.__nuxtDesignTokensBuildDir__}index.ts`)

  const { $dt } = jiti(import.meta.url)(module)

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
