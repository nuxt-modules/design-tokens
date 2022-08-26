import { createUnplugin } from 'unplugin'
import { Nuxt } from '@nuxt/schema'
import { resolveDt, resolveScreen, resolveComponent, resolveScheme, resolveVariantProps } from './resolvers'
import { resolveStyleTs } from './css'

const jsFilesRegex = /\.((c|m)?j|t)sx?$/g
const vueRootRegex = /.vue(?!&type=style)/
const vueStyleRegex = /vue&type=style/
const templateRegex = /<template.*>(.|\n)*?<\/template>/g
const scriptRegex = /<script.*>(.|\n)*?<\/script>/g
const styleTsRegex = /<style.*(scoped)?.*(lang="(ts|js)").*>(.|\n)*?<\/style>/g
const styleTsLangRegex = /<style.*lang="(ts|js)".*>/

/**
 * Unplugin resolving `$dt()` `@screen`, `@light`, `@dark`, `@component` in `<style>` tags.
 */
export const unpluginDesignTokensStyle = createUnplugin<any>((
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

export const unpluginDesignTokensComponents = createUnplugin<any>(() => {
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

      // Run transforms in <script> tag
      code = code.replace(
        scriptRegex,
        (code) => {
          code = resolveDt(code, '\'')
          return resolveVariantProps(code)
        }
      )

      code = code.replace(
        styleTsRegex,
        (...parts) => {
          let [code] = parts

          code = resolveStyleTs(code)

          // Cast `lang="ts|js"` to `lang="postcss"`
          code = code.replace(styleTsLangRegex, (styleTag, lang) => styleTag.replace(lang, 'postcss'))

          return code
        }
      )

      return { code }
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
      unpluginDesignTokensStyle.webpack(options),
      unpluginDesignTokensComponents.webpack(options)
    )
  })

  // Vite plugin
  nuxt.hook('vite:extend', (vite: any) => {
    vite.config.plugins = vite.config.plugins || []
    vite.config.plugins.push(
      unpluginDesignTokensStyle.vite(options),
      unpluginDesignTokensComponents.vite(options)
    )
  })
}
