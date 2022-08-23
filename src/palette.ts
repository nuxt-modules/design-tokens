import chroma, { Color } from 'chroma-js'
// @ts-ignore
import type { DesignTokens } from '#design-tokens/types'

export const palette = (
  color: string,
  suffixes: Array<string | number> = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900],
  padding: number = 0.1
): DesignTokens => {
  if (!color || typeof color !== 'string') {
    throw new Error('Please provide a valid "color" string parameter')
  }

  function scalePalette (baseColor: Color | string, _suffixes: Array<string | number> = suffixes, _padding: number = padding) {
    const colorscale = chroma.scale(['white', baseColor, 'black']).padding(padding).colors(suffixes.length)

    const colorRange = {}

    suffixes.forEach(
      (suffix, index) => (
        colorRange[suffix] = {
          value: colorscale[index]
        }
      )
    )

    colorRange[500] = {
      value: baseColor
    }

    return colorRange
  }

  return {
    ...scalePalette(color),
    palette: true
  }
}
