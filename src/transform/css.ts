// eslint-disable-next-line import/default
import json5 from 'json5'
import { stringify } from '@stitches/stringify'
import { referencesRegex } from '../formats/references'
import { $tokens } from '../index'

const cssContentRegex = /css\(({.*?\})\)/mgs

export const resolveStyleTs = (code: string = '', variantsProps = {}) => {
  const resolveVariantProps = (property: string, value: any) => {
    variantsProps[property] = Object.entries(value).reduce(
      (acc, [key, _]) => {
        acc[key] = {
          type: Boolean,
          required: false,
          default: false
        }
        return acc
      },
      {}
    )
  }

  code = code.replace(
    cssContentRegex,
    (...cssFunctionMatch) => {
      // Parse css({}) content
      const declaration = json5.parse(cssFunctionMatch[1])

      const style = stringify(
        declaration,
        (property, value) => {
          // Match reserved directives (@screen, @dark, @light)
          if (property.startsWith('@')) {
            const DARK = '@dark'
            const LIGHT = '@light'
            const SCREEN = /@screen:(.*)/
            const screenMatches = property.match(SCREEN)
            if (property === DARK) {
              return {
                '@media (prefers-color-scheme: dark)': value
              }
            }
            if (property === LIGHT) {
              return {
                '@media (prefers-color-scheme: light)': value
              }
            }
            if (screenMatches) {
              const screenToken = $tokens(`screens.${screenMatches[1]}` as any, { flatten: false, key: undefined, silent: true })
              return {
                [`@media (min-width: ${screenToken.original.value})`]: value
              }
            }
          }

          // Push variants to variantsProps
          if (value.variants) {
            resolveVariantProps(property, value.variants)
          }

          // Transform variants to nested selectors
          if (property === 'variants') {
            return Object.entries(value).reduce(
              (acc, [key, value]) => {
                acc['&.' + key] = value
                return acc
              },
              {}
            )
          }

          if (typeof value === 'string') {
            value = value.replace(
              referencesRegex,
              (...parts) => {
                const [, tokenPath] = parts

                const token = $tokens(tokenPath)

                return token
              }
            )
          }

          return {
            [property]: value
          }
        }
      )

      return style
    }
  )

  return code
}
