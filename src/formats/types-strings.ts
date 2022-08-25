import { get } from '../utils'

export const getFunction = `const get = ${get.toString()}`

export const DesignTokenType =
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

export const DesignTokensType =
`interface DesignTokens {
  [key: string]: DesignTokens | DesignToken;
}`

export const TokenHelperOptionsType =
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
