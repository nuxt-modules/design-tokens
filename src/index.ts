import { resolveModule } from '@nuxt/kit'
import jiti from 'jiti'
import type { Defu } from 'defu'
import { palette } from './palette'
import { compose } from './compose'
import { generateTokens } from './runtime/server/utils'
// @ts-ignore
import type { DesignTokens, DesignTokensPaths, DesignToken, TokenHelperOptions, NuxtDesignTokens as GeneratedDesignTokens } from '#design-tokens/types'

export interface ScaleTokens extends DesignTokens {
  [key: string]: {
    default?: DesignToken | DesignTokens
    50?: DesignToken | DesignTokens
    100?: DesignToken | DesignTokens
    200?: DesignToken | DesignTokens
    300?: DesignToken | DesignTokens
    400?: DesignToken | DesignTokens
    500?: DesignToken | DesignTokens
    600?: DesignToken | DesignTokens
    700?: DesignToken | DesignTokens
    800?: DesignToken | DesignTokens
    900?: DesignToken | DesignTokens
  } | DesignToken
}

export interface BreakpointsTokens extends DesignTokens {
  '2xs'?: DesignToken
  xs?: DesignToken
  sm?: DesignToken
  md?: DesignToken
  lg?: DesignToken
  xl?: DesignToken
  '2xl'?: DesignToken
  '3xl'?: DesignToken
  '4xl'?: DesignToken
  '5xl'?: DesignToken
}

export interface FontWeightTokens extends DesignTokens {
  thin?: DesignToken
  extraLight?: DesignToken
  light?: DesignToken
  regular?: DesignToken
  medium?: DesignToken
  semiBold?: DesignToken
  bold?: DesignToken
  extraBold?: DesignToken
  black?: DesignToken
  heavyBlack: DesignToken
}

export interface GlobalTokens extends DesignTokens {
  // Sugested keys
  colors?: ScaleTokens
  fonts?: DesignTokens
  fontWeights?: FontWeightTokens
  sizes?: BreakpointsTokens
  screens?: BreakpointsTokens
  radius?: BreakpointsTokens
  borders?: BreakpointsTokens
  shadows?: BreakpointsTokens
  opacity: BreakpointsTokens
  lineHeight?: BreakpointsTokens
  lineHeights?: BreakpointsTokens
  letterSpacings?: BreakpointsTokens
  transitions?: DesignTokens
  z?: DesignTokens
  // Reserved keys
  components?: DesignTokens
}

export interface NuxtDesignTokens extends DesignTokens, Defu<GeneratedDesignTokens, [GlobalTokens]> {}

export interface NuxtDesignTokensConfig {
  server?: boolean
  tokens?: NuxtDesignTokens | boolean | string
}

export interface ModuleOptions extends NuxtDesignTokensConfig {}

export interface ModuleHooks {}

export interface ModulePublicRuntimeConfig {}

// Non-reactive data taken from initial boot
export interface ModulePrivateRuntimeConfig {
  tokensDir?: string
  server?: boolean
  tokensFilePaths?: Array<string>
}

export type DeepPartial<T> = T extends object ? { [P in keyof T]?: DeepPartial<T[P]>; } : T;

export { generateTokens, palette, compose }

export const defineTokens = (tokens: DeepPartial<NuxtDesignTokens>): DeepPartial<NuxtDesignTokens> => tokens

export const $tokens = (
  path: DesignTokensPaths,
  options: TokenHelperOptions = {
    key: 'variable',
    flatten: true,
    silent: false
  }
) => {
  const module = resolveModule(`${globalThis.__nuxtDesignTokensBuildDir__}index.ts`)

  const { $dt } = jiti(import.meta.url, { cache: false, requireCache: false, v8cache: false })(module)

  return $dt(path, options)
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
