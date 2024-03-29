import * as CSSType from 'csstype'
import * as Utils from '../utils'
import { DefaultThemeMap, NuxtStyleTheme, ThemeKey } from '../config'
import { NuxtThemeTokens } from '#design-tokens/types'

export type VuePseudos =
| '&:deep('
| '&:slotted('
| ':global('

export type AdvancedPseudos =
  | '&::cue('
  | '&::cue-region('
  | '&::part('
  | '&::slotted('
  | '&:dir('
  | '&:has('
  | '&:host('
  | '&:host-context('
  | '&:is('
  | '&:lang('
  | '&:not('
  | '&:nth-child('
  | '&:nth-last-child('
  | '&:nth-last-of-type('
  | '&:nth-of-type('
  | '&:where(';

export type SimplePseudos =
  | '&::after'
  | '&::backdrop'
  | '&::before'
  | '&::cue'
  | '&::cue-region'
  | '&::first-letter'
  | '&::first-line'
  | '&::grammar-error'
  | '&::marker'
  | '&::placeholder'
  | '&::selection'
  | '&::spelling-error'
  | '&::target-text'
  | '&:active'
  | '&:after'
  | '&:any-link'
  | '&:before'
  | '&:blank'
  | '&:checked'
  | '&:current'
  | '&:default'
  | '&:defined'
  | '&:disabled'
  | '&:empty'
  | '&:enabled'
  | '&:first'
  | '&:first-child'
  | '&:first-letter'
  | '&:first-line'
  | '&:first-of-type'
  | '&:focus'
  | '&:focus-visible'
  | '&:focus-within'
  | '&:fullscreen'
  | '&:future'
  | '&:hover'
  | '&:in-range'
  | '&:indeterminate'
  | '&:invalid'
  | '&:last-child'
  | '&:last-of-type'
  | '&:left'
  | '&:link'
  | '&:local-link'
  | '&:nth-col'
  | '&:nth-last-col'
  | '&:only-child'
  | '&:only-of-type'
  | '&:optional'
  | '&:out-of-range'
  | '&:past'
  | '&:paused'
  | '&:picture-in-picture'
  | '&:placeholder-shown'
  | '&:read-only'
  | '&:read-write'
  | '&:required'
  | '&:right'
  | '&:root'
  | '&:scope'
  | '&:target'
  | '&:target-within'
  | '&:user-invalid'
  | '&:user-valid'
  | '&:valid'
  | '&:visited';

export type Pseudos = AdvancedPseudos | SimplePseudos;

interface NativeProperties extends
  CSSType.StandardProperties,
  CSSType.StandardShorthandProperties,
  CSSType.StandardProperties,
  CSSType.SvgProperties {}

/**
 * Pseudos to be used in `css({ ':pseudo': { ...} })`
 */
export type PseudosProperties = {
  [key in Pseudos]?: NativeProperties
}

export type CssProperties = NativeProperties & PseudosProperties

const schemes = {
  '@dark': true,
  '@light': true
} as const

export type PermissiveVariants<K> = {
  [key in string]?: (
    | K
    | undefined
    | {}
  )
}

export type CSS<
  TemplateTags extends object = {},
  Theme extends object = NuxtThemeTokens
> =
  {
    [key in keyof Utils.PrefixObjectKeys<
      // @ts-ignore - Might not be defiend by the user
      Theme['screens'],
      '@screen:'
    >]?: (
      | CSS<TemplateTags, Theme>
    )
  }
  &
  {
    [key in keyof typeof schemes]?: (
      | CSS<TemplateTags, Theme>
      | undefined
      | {}
    )
  }
  &
  // Reserved `variants` key keys
  {
    variants?: (
      | PermissiveVariants<CSS<TemplateTags, Theme>>
    )
  }
  &
  // Template tags (coming from Volar)
  {
    [K in keyof TemplateTags]?: (
      | CSS<TemplateTags, Theme>
      | undefined
      | {}
    )
  }
  &
  {
    [K in keyof DefaultThemeMap]?: (
      | ThemeKey<K>
      | CssProperties[K]
      | undefined
      | {}
    )
  }
  &
  // CSS Properties
  {
    [K in Exclude<keyof CssProperties, keyof DefaultThemeMap>]?: (
      | CssProperties[K]
      | undefined
      | {}
    )
  }
  &
  // Other properties (nested selector)
  {
    [K: string]: (
      | number
      | string
      | CSS<TemplateTags, Theme>
      | {}
      | undefined
    )
  }

export const css = (
  declaration: CSS<
    {},
    NuxtStyleTheme
  >
) => declaration

export type CssFunctionType = typeof css
