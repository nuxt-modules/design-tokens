import * as CSSType from 'csstype'
import { kebabCase } from 'scule'
import { DesignToken } from '#design-tokens/types'

interface CSSProperties extends
  CSSType.StandardProperties,
  CSSType.StandardShorthandProperties,
  CSSType.StandardProperties,
  CSSType.SvgProperties {}

/**
 * Properties to be used in `compose({ ...properties })`
 */
export type Properties = {
  [key in keyof CSSProperties]?: CSSProperties[key]
}

/**
 * Pseudos to be used in `compose({ ':pseudo': { ...} })`
 */
export type Pseudos = {
  [key in CSSType.Pseudos]?: Properties
}

export type Variants = {
  [key: string]: Properties & Pseudos
}

export interface Compose extends Properties, Pseudos {
  variants: Variants
}

const pseudosRegex = /(::-|::|:-|:)/g

/**
 * Compose a CSS style declaration from a type-safe JS object.
 *
 * Supports pseudo and nested selectors.
 */
export const compose = (properties: Compose) => {
  const componentTokens = {}

  /**
   * Resolve properties from `compose()` declaration.
   */
  const resolveComponentTokens = (
    composeProperties: Compose,
    target: any,
    {
      prefix = '',
      pseudo = '',
      variant = ''
    }: Partial<DesignToken> = {}
  ) => {
    const createValue = (key: string, value: any, options: any) => {
      const rawProperty = kebabCase(key)
      const property = (options?.prefix || '') + rawProperty

      // Cleanup
      delete options.prefix

      // Set value from attribute and follow attribute
      if (typeof value !== 'object') {
        target[property] = {
          value,
          property: rawProperty,
          ...options
        }
      } else {
        target[property] = {
          ...value,
          property: rawProperty,
          ...options
        }
      }
    }

    Object
      .entries(composeProperties)
      .forEach(([key, value]) => {
        // Check on pseudos keys
        if (pseudosRegex.test(key)) {
          const pseudoPrefix = key.replace(pseudosRegex, '')

          resolveComponentTokens(
            value as any,
            target,
            {
              prefix: `${pseudoPrefix}-`,
              pseudo: key
            }
          )

          return
        }

        if (key === 'variants') {
          Object
            .entries(value)
            .forEach(
              ([_variantKey, _variantValue]) => {
                if (!target.variants) { target.variants = {} }
                if (!target.variants[_variantKey]) { target.variants[_variantKey] = {} }
                resolveComponentTokens(_variantValue as any, target.variants[_variantKey], { variant: _variantKey })
              }
            )

          return
        }

        createValue(key, value, { prefix, pseudo, variant })
      })

    return componentTokens
  }

  const component = resolveComponentTokens(properties, componentTokens)

  return {
    ...component,
    composed: true
  }
}
