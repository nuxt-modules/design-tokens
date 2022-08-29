import { resolveModule } from '@nuxt/kit'
import jiti from 'jiti'
import { palette } from './palette'
import * as Generated from '#design-tokens/types'

export * from './config'

export * from './css'

export interface ModulePrivateRuntimeConfig {
  tokensDir?: string
  server?: boolean
  tokensFilePaths?: Array<string>
}

export { palette }

export const $tokens = (
  path: Generated.NuxtThemeTokensPaths,
  options: Generated.TokenHelperOptions = {
    key: 'variable',
    flatten: true,
    silent: false
  }
) => {
  const module = resolveModule(`${globalThis.__NuxtThemeTokensBuildDir__}index.ts`)

  const { $dt } = jiti(import.meta.url, { cache: false, requireCache: false, v8cache: false })(module)

  return $dt(path, options)
}

export type DtFunctionType = typeof $tokens

export const $dt = $tokens

export interface NuxtStyleConfig {
  server?: boolean
  tokens?: Generated.NuxtThemeTokens | boolean
}

export interface ModuleOptions extends NuxtStyleConfig {}

export interface ModuleHooks {}

export interface ModulePublicRuntimeConfig {}

declare module '@nuxt/schema' {
  interface PublicRuntimeConfig {
    // @ts-ignore
    style?: ModulePublicRuntimeConfig;
  }

  interface RuntimeConfig {
    // @ts-ignore
    style?: ModulePrivateRuntimeConfig;
  }

  interface NuxtConfig {
    // @ts-ignore
    style?: Partial<ModuleOptions>
  }

  interface NuxtOptions {
    // @ts-ignore
    style?: ModuleOptions
  }
}
