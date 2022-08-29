import type { Defu } from 'defu'
import type { DeepPartial, NestedKeyOf, WrapUnion } from '../utils'
import type { NuxtDesignTokens, DesignToken, NuxtThemeTokens as GeneratedThemeTokens } from '#design-tokens/types'

export interface ScaleTokens extends NuxtDesignTokens {
  [key: string]: {
    default?: DesignToken | NuxtDesignTokens
    50?: DesignToken | NuxtDesignTokens
    100?: DesignToken | NuxtDesignTokens
    200?: DesignToken | NuxtDesignTokens
    300?: DesignToken | NuxtDesignTokens
    400?: DesignToken | NuxtDesignTokens
    500?: DesignToken | NuxtDesignTokens
    600?: DesignToken | NuxtDesignTokens
    700?: DesignToken | NuxtDesignTokens
    800?: DesignToken | NuxtDesignTokens
    900?: DesignToken | NuxtDesignTokens
  } | DesignToken
}

export interface BreakpointsTokens extends NuxtDesignTokens {
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

export interface FontWeightTokens extends NuxtDesignTokens {
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

export interface GlobalTokens {
  colors?: ScaleTokens
  fonts?: NuxtDesignTokens
  fontWeights?: FontWeightTokens
  fontSizes?: BreakpointsTokens
  sizings?: BreakpointsTokens
  spacings?: BreakpointsTokens
  screens?: BreakpointsTokens
  radius?: BreakpointsTokens
  borders?: BreakpointsTokens
  borderWidths?: BreakpointsTokens
  shadows?: BreakpointsTokens
  opacity: BreakpointsTokens
  lineHeight?: BreakpointsTokens
  lineHeights?: BreakpointsTokens
  letterSpacings?: BreakpointsTokens
  transitions?: NuxtDesignTokens
  z?: NuxtDesignTokens
}

export interface NuxtStyleTheme extends NuxtDesignTokens, Defu<GeneratedThemeTokens, [GlobalTokens]> {}

export type DefaultThemeMap = {
  gap: 'spacings'
  columnGap: 'spacings'
  rowGap: 'spacings'
  inset: 'spacings'
  insetBlock: 'spacings'
  insetBlockEnd: 'spacings'
  insetBlockStart: 'spacings'
  insetInline: 'spacings'
  insetInlineEnd: 'spacings'
  insetInlineStart: 'spacings'
  margin: 'spacings'
  marginTop: 'spacings'
  marginRight: 'spacings'
  marginBottom: 'spacings'
  marginLeft: 'spacings'
  marginBlock: 'spacings'
  marginBlockEnd: 'spacings'
  marginBlockStart: 'spacings'
  marginInline: 'spacings'
  marginInlineEnd: 'spacings'
  marginInlineStart: 'spacings'
  padding: 'spacings'
  paddingTop: 'spacings'
  paddingRight: 'spacings'
  paddingBottom: 'spacings'
  paddingLeft: 'spacings'
  paddingBlock: 'spacings'
  paddingBlockEnd: 'spacings'
  paddingBlockStart: 'spacings'
  paddingInline: 'spacings'
  paddingInlineEnd: 'spacings'
  paddingInlineStart: 'spacings'
  scrollMargin: 'spacings'
  scrollMarginTop: 'spacings'
  scrollMarginRight: 'spacings'
  scrollMarginBottom: 'spacings'
  scrollMarginLeft: 'spacings'
  scrollMarginBlock: 'spacings'
  scrollMarginBlockEnd: 'spacings'
  scrollMarginBlockStart: 'spacings'
  scrollMarginInline: 'spacings'
  scrollMarginInlineEnd: 'spacings'
  scrollMarginInlineStart: 'spacings'
  scrollPadding: 'spacings'
  scrollPaddingTop: 'spacings'
  scrollPaddingRight: 'spacings'
  scrollPaddingBottom: 'spacings'
  scrollPaddingLeft: 'spacings'
  scrollPaddingBlock: 'spacings'
  scrollPaddingBlockEnd: 'spacings'
  scrollPaddingBlockStart: 'spacings'
  scrollPaddingInline: 'spacings'
  scrollPaddingInlineEnd: 'spacings'
  scrollPaddingInlineStart: 'spacings'
  top: 'spacings'
  right: 'spacings'
  bottom: 'spacings'
  left: 'spacings'
  fontSize: 'fontSizes'
  background: 'colors'
  backgroundColor: 'colors'
  backgroundImage: 'colors'
  borderImage: 'colors'
  border: 'borders'
  borderBlock: 'borders'
  borderBlockEnd: 'borders'
  borderBlockStart: 'borders'
  borderBottom: 'borders'
  borderBottomColor: 'borders'
  borderColor: 'colors'
  borderInline: 'colors'
  borderInlineEnd: 'colors'
  borderInlineStart: 'colors'
  borderLeft: 'colors'
  borderLeftColor: 'colors'
  borderRight: 'colors'
  borderRightColor: 'colors'
  borderTop: 'colors'
  borderTopColor: 'colors'
  caretColor: 'colors'
  color: 'colors'
  columnRuleColor: 'colors'
  outline: 'colors'
  outlineColor: 'colors'
  fill: 'colors'
  stroke: 'colors'
  textDecorationColor: 'colors'
  fontFamily: 'fonts'
  fontWeight: 'fontWeights'
  lineHeight: 'lineHeights'
  letterSpacing: 'letterSpacings'
  blockSize: 'sizings'
  minBlockSize: 'sizings'
  maxBlockSize: 'sizings'
  inlineSize: 'sizings'
  minInlineSize: 'sizings'
  maxInlineSize: 'sizings'
  width: 'sizings'
  minWidth: 'sizings'
  maxWidth: 'sizings'
  height: 'sizings'
  minHeight: 'sizings'
  maxHeight: 'sizings'
  flexBasis: 'sizings'
  gridTemplateColumns: 'sizings'
  gridTemplateRows: 'sizings'
  borderWidth: 'borderWidths'
  borderTopWidth: 'borderWidths'
  borderLeftWidth: 'borderWidths'
  borderRightWidth: 'borderWidths'
  borderBottomWidth: 'borderWidths'
  borderRadius: 'radius'
  borderTopLeftRadius: 'radius'
  borderTopRightRadius: 'radius'
  borderBottomRightRadius: 'radius'
  borderBottomLeftRadius: 'radius'
  boxShadow: 'shadows'
  textShadow: 'shadows'
  transition: 'transitions'
  zIndex: 'z'
}

export type ThemeKey<
  K extends keyof DefaultThemeMap
> = WrapUnion<
    NestedKeyOf<NuxtStyleTheme[DefaultThemeMap[K]]>,
    `{${DefaultThemeMap[K]}.`,
    '}'
  >

export const defineTokens = (tokens: DeepPartial<NuxtStyleTheme>): DeepPartial<NuxtStyleTheme> => tokens
