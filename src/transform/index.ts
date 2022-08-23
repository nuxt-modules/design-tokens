import { kebabCase } from 'scule'
import { createUnplugin } from 'unplugin'
import chalk from 'chalk'
import { Nuxt } from '@nuxt/schema'
import { logger } from '../utils'
import { $tokens } from '../index'
import type { DesignTokens, DesignToken } from '#design-tokens/types'

/**
 * Regexes used accross resolvers.
 */

// const componentNameRegex = /([^/]*\.vue)/
const variantPropsRegex = /\$variantProps\('(.*)'\)/g
const screenRegex = /(@screen\s(.*?)\s{)/g
const darkRegex = /(@dark\s{)/g
const lightRegex = /(@light\s{)/g
const dtRegex = /\$dt\('(.*?)'\)/g
const componentRegex = /@component\('(.*?)'\);/g

/**
 * Unplugin resolving `$dt()` `@screen`, `@light`, `@dark`, `@component` in `<style>` tags.
 */
export const unpluginDesignTokens = createUnplugin<any>((
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  { tokensDir, tokensFilePaths }
) => {
  return {
    name: 'unplugin-nuxt-design-tokens',

    enforce: 'pre',

    transformInclude (id) {
      // Check if the target is a Vue <style> attribute.
      const regex = /.vue/
      return regex.test(id)
    },

    transform (code, id) {
      code = resolveToken(code)

      code = resolveVariantProps(code)

      code = resolveScreen(code, id)

      code = resolveScheme(code, 'dark')

      code = resolveScheme(code, 'light')

      code = resolveComponent(code)

      return { code }
    }
  }
})

/**
 * Resolve `$dt()` declarations.
 */
const resolveToken = (code: string) => {
  const replace = (path: string): string => `var(--${path.split('.').map(key => kebabCase(key)).join('-')})`

  code = code.replace(dtRegex, (_, path) => replace(path))

  return code
}

/**
 * Resolve `@component()`.
 */
const resolveVariantProps = (code: string): string => {
  code = code.replace(variantPropsRegex, (_, componentName) => {
    const variants = $tokens(('components.' + componentName + '.variants') as any, { key: undefined, flatten: false })

    return `{
      variants: {
        type: [Array] as import('vue').PropType<${Object.keys(variants).map(variant => `'${variant}'`).join(' | ')}>,
        required: false,
        default: []
      }
    }`
  })

  return code
}

const resolveScheme = (code: string, scheme: 'light' | 'dark') => {
  // Only supports `light` and `dark` schemes as they are native from browsers.
  const schemesRegex = {
    lightRegex,
    darkRegex
  }

  code = code.replace(schemesRegex[scheme + 'Regex'], `@media (prefers-color-scheme: ${scheme}) {`)

  return code
}

/**
 * Resolve `@screen {screenSize}` declarations.
 */
const resolveScreen = (code: string, id: string): string => {
  const screens = $tokens('screens', {
    flatten: false,
    key: undefined
  })

  code = code.replace(screenRegex, (_, _screenDeclaration, screenSize) => {
    const screenToken = screens[screenSize]

    if (screenToken) {
      return `@media (min-width: ${screenToken.value}) {`
    }

    logger.warn(
      'Error in component:',
      id,
      'This screen size is not defined: ' + chalk.red(screenSize) + '\n\n',
      'Available screen sizes: ', Object.keys(screens).map(screen => chalk.green(screen)).join(', ')
    )

    return '@media (min-width: 0px) {'
  })

  return code
}

/**
 * Resolve `@component()`.
 */
const resolveComponent = (code: string): string => {
  code = code.replace(componentRegex, (_, componentName) => {
    const component = $tokens(('components.' + componentName) as any, { key: undefined, flatten: false })

    if (component && Object.keys(component)) {
      const styleDeclaration = resolveStyleFromComponent(component)
      return styleDeclaration
    }

    return ''
  })

  return code
}

/**
 * Resolve unwrapped style properties for `@component()` declaration.
 */
const resolveStyleFromComponent = (component: DesignTokens): string => {
  // Prepare style declaration
  let styleDeclaration = ''
  const styles = {
    root: {
      propertiesLines: [],
      nestings: []
    }
  }

  // Deeply resolving `compose` definition from tokens
  const resolvePropertiesObject = (value: DesignToken, target = styles.root) => {
    Object.entries(value).forEach(([_key, _value]: [any, DesignToken]) => {
      const { variable, pseudo, property } = _value

      if (_key === 'variants') {
        Object.entries(_value).forEach(([_variantKey, _variantValue]) => {
          // Init variant
          if (!styles[_variantKey]) {
            styles[_variantKey] = {
              nestings: [],
              propertiesLines: []
            }
          }

          resolvePropertiesObject(_variantValue, styles[_variantKey])
        })
        return
      }

      if (pseudo) {
        if (!target.nestings[pseudo]) { target.nestings[pseudo] = [] }
        target.nestings[pseudo].push(`${property}: ${variable};`)
        return
      }

      target.propertiesLines.push(`${property}: ${variable};`)
    }, {})
  }
  resolvePropertiesObject(component)

  // Recompose styles
  Object
    .entries(styles)
    .forEach(
      ([key, { propertiesLines, nestings }]) => {
        let localDeclaration = ''
        localDeclaration = propertiesLines.join('\n')
        Object.entries(nestings).forEach(([nested, _propertiesLines]) => {
          localDeclaration += `\n&${nested} {\n${_propertiesLines.join('\n')}\n}`
        })

        key === 'root'
          ? styleDeclaration += localDeclaration
          : styleDeclaration += `&.${key} {\n${localDeclaration}\n}`
      }
    )

  return styleDeclaration
}

/**
 * Registers the transform plugin.
 */
export const registerTransformPlugin = (nuxt: Nuxt, options) => {
  // Webpack plugin
  nuxt.hook('webpack:config', (config: any) => {
    config.plugins = config.plugins || []
    config.plugins.unshift(
      unpluginDesignTokens.webpack(options)
    )
  })

  // Vite plugin
  nuxt.hook('vite:extend', (vite: any) => {
    vite.config.plugins = vite.config.plugins || []
    vite.config.plugins.push(
      unpluginDesignTokens.vite(options)
    )
  })
}
