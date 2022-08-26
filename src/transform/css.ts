import { parse } from 'json5'
import { stringify } from '@stitches/stringify'
import { referencesRegex } from '../formats/references'
import { $tokens } from '../index'

const cssContentRegex = /css\(({.*?\})\)/mgs

export const resolveStyleTs = (code: string) => {
  code = code.replace(
    cssContentRegex,
    (...code) => {
      const declaration = parse(code[1])

      const css = stringify(
        declaration,
        (property, value) => {
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
                const [_, tokenPath] = parts

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

      return css
    }
  )

  return code
}
