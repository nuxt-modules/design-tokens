import { createUnplugin } from 'unplugin'
import { Nuxt } from '@nuxt/schema'
import { resolveDt, resolveScreen, resolveComponent, resolveScheme, resolveVariantProps, resolverRegexes } from './resolvers'
import { resolveStyleTs } from './css'

const jsFilesRegex = /\.((c|m)?j|t)sx?$/g
const vueRootRegex = /.vue(?!&type=style)/
const vueStyleRegex = /vue&type=style/
const templateRegex = /<template.*>(.|\n)*?<\/template>/g
const scriptRegex = /<script.*>(.|\n)*?<\/script>/g
const styleTsRegex = /<style.*(scoped)?.*(lang="(ts|js)").*>(.|\n)*?<\/style>/g
const styleTsLangRegex = /<style.*lang="(ts|js)".*>/

const sfcRegexes = {
  jsFiles: jsFilesRegex,
  vueRoot: vueRootRegex,
  vueStyle: vueStyleRegex,
  template: templateRegex,
  script: scriptRegex,
  styleTs: styleTsRegex,
  styleTsLang: styleTsLangRegex
}

export const regexes = {
  ...sfcRegexes,
  ...resolverRegexes
}

/**
 * Unplugin resolving `$dt()` `@screen`, `@light`, `@dark`, `@component` in `<style>` tags.
 */
export const unpluginNuxtStyle = createUnplugin<any>((
  { hasTailwind }
) => {
  return {
    name: 'unplugin-nuxt-design-tokens-style',

    enforce: 'pre',

    transformInclude (id) {
      // Check if the target is a Vue <style> attribute.
      return vueStyleRegex.test(id)
    },

    transform (code, id) {
      code = resolveDt(code)

      if (hasTailwind) {
        code = resolveScreen(code, id)
      }

      code = resolveScheme(code, 'dark')

      code = resolveScheme(code, 'light')

      code = resolveComponent(code)

      return { code }
    }
  }
})

export const unpluginNuxtStyleComponents = createUnplugin<any>(() => {
  return {
    name: 'unplugin-nuxt-design-tokens-components',

    enforce: 'pre',

    transformInclude (id) {
      // Check if the target is a Vue <style> attribute.
      return vueRootRegex.test(id) || jsFilesRegex.test(id)
    },

    transform (code) {
      // Run transforms in <template> tag
      code = code.replace(
        templateRegex,
        (code) => {
          return resolveDt(code, '\'')
        }
      )

      let variantProps
      code = code.replace(
        styleTsRegex,
        (...parts) => {
          let [code] = parts

          const { code: _code, variantsProps: _variantProps } = resolveStyleTs(code)

          code = _code
          variantProps = _variantProps

          // Cast `lang="ts|js"` to `lang="postcss"`
          code = code.replace(
            styleTsLangRegex,
            (styleTag, lang) => {
              styleTag = styleTag.replace(lang, 'postcss')
              styleTag = styleTag.replace('>', ` ${Date.now()}>`)
              return styleTag
            }
          )

          return code
        }
      )

      // Run transforms in <script> tag
      code = code.replace(
        scriptRegex,
        (scriptTag) => {
          console.log({ variantProps })
          scriptTag = resolveDt(scriptTag, '\'')
          scriptTag = resolveVariantProps(scriptTag, variantProps)
          return scriptTag
        }
      )

      return {
        code
      }
    }
  }
})
/**
 * Registers the transform plugin.
 */
export const registerTransformPlugin = (nuxt: Nuxt, options: any) => {
  // Webpack plugin
  nuxt.hook('webpack:config', (config: any) => {
    config.plugins = config.plugins || []
    config.plugins.unshift(
      unpluginNuxtStyleComponents.webpack(options),
      unpluginNuxtStyle.webpack(options)
    )
  })

  // Vite plugin
  nuxt.hook('vite:extend', (vite: any) => {
    vite.config.plugins = vite.config.plugins || []
    vite.config.plugins.push(
      unpluginNuxtStyleComponents.vite(options),
      unpluginNuxtStyle.vite(options)
    )
  })
}
