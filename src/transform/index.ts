import fs from 'fs'
import { createUnplugin } from 'unplugin'
import { Nuxt } from '@nuxt/schema'
import { compileStyle, parse } from '@vue/compiler-sfc'
import MagicString from 'magic-string'
import { ViteDevServer } from 'vite'
import { parseVueRequest } from '../utils/vue'
import { resolveDt, resolveVariantProps, resolverRegexes, resolveStyle } from './resolvers'
import { resolveStyleTs } from './css'

const excludedPaths = [
  'node_modules/nuxt/dist',
  'node_modules/@vue/'
]
const jsFilesRegex = /\.((c|m)?j|t)sx?$/g
const vueRootRegex = /.vue(?!&type=style)/
const vueStyleRegex = /vue&type=style/
const templateRegex = /<template.*>(.|\n)*?<\/template>/g
const scriptRegex = /<script.*>(.|\n)*?<\/script>/g
const styleTsRegex = /<style.*(scoped)?.*(lang="(ts|js)").*>(.|\n)*?<\/style>/g
const styleTsLangRegex = /lang="(ts|js)"/

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
// @ts-ignore
export const unpluginNuxtStyle = createUnplugin<any>(({ components }: { components: any[], tokensDir: string }) => {
  return {
    name: 'unplugin-nuxt-design-tokens-style',

    enforce: 'pre',

    load (id) {
      const { filename, query } = parseVueRequest(id)

      // Process `lang="ts"` blocks
      if (query.vue && query.type === 'style') {
        const file = fs.readFileSync(filename, 'utf8')

        const { descriptor } = parse(file, { filename })

        const styleTagContent = descriptor.styles.find(
          ({ lang, scoped }) => {
            return lang === 'ts' && !!query.scoped === scoped
          }
        )

        if (!styleTagContent) { return }

        let source = styleTagContent?.content || ''
        source = resolveStyleTs(source)
        source = resolveStyle(source)

        return source
      }
    },

    transformInclude (id) {
      // Use Vue's query parser
      const { query } = parseVueRequest(id)

      // Stop on excluded paths.
      if (excludedPaths.some(path => id.includes(path))) { return false }

      // // Run only on Nuxt loaded components
      if (components.some(({ filePath }) => id.includes(filePath))) { return true }

      // Parse common regexes
      return query?.vue
    },

    transform (code, id) {
      const { filename, query } = parseVueRequest(id)

      // Create sourceMap compatible string
      const magicString = new MagicString(code, { filename })
      const result = () => ({ code: magicString.toString(), map: magicString.generateMap() })

      try {
        if (query.type === 'style') {
          code = resolveStyleTs(code)
          code = resolveStyle(code)
          return code
        }

        // Resolve from parsing the <style lang="ts"> tag for current component
        const variantProps = {}

        // Parse component with compiler-sfc
        const parsedComponent = parse(code, { filename })

        // Run transforms in <template> tag
        if (parsedComponent.descriptor.template) {
          const templateContent = parsedComponent.descriptor.template
          let newTemplateContent = templateContent.content
          newTemplateContent = resolveDt(newTemplateContent, '\'')
          magicString.overwrite(templateContent.loc.start.offset, templateContent.loc.end.offset, newTemplateContent)
        }

        // Parse <style .*> blocks
        if (parsedComponent.descriptor.styles) {
          const styles = parsedComponent.descriptor.styles
          styles.forEach(
            (styleBlock) => {
              const { loc, content } = styleBlock
              let newStyle = content

              newStyle = resolveStyleTs(newStyle, variantProps)
              newStyle = resolveStyle(newStyle)

              magicString.remove(loc.start.offset, loc.end.offset)
              magicString.appendRight(
                loc.end.offset,
                '\n' + newStyle + '\n'
              )
            }
          )
        }

        // Handles <script setup> ($dt(), $variantProps)
        if (parsedComponent.descriptor.scriptSetup) {
          const scriptSetup = parsedComponent.descriptor.scriptSetup
          let newScriptSetup = scriptSetup.content
          newScriptSetup = resolveDt(newScriptSetup, '`')
          newScriptSetup = resolveVariantProps(newScriptSetup, variantProps)
          magicString.overwrite(scriptSetup.loc.start.offset, scriptSetup.loc.end.offset, newScriptSetup)
        }
      } catch (e) {
        console.log({ error: e })
      }

      return result()
    }
  }
}
)

/**
 * Registers the transform plugin.
 */
export const registerTransformPlugin = (nuxt: Nuxt, options: any) => {
  // Webpack plugin
  nuxt.hook('webpack:config', (config: any) => {
    config.plugins = config.plugins || []
    config.plugins.unshift(
      unpluginNuxtStyle.webpack(options)
    )
  })

  // Vite plugin
  nuxt.hook('vite:extend', (vite: any) => {
    vite.config.plugins = vite.config.plugins || []
    vite.config.plugins.push(
      unpluginNuxtStyle.vite(options)
    )
  })
}
