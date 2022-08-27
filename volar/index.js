const { walkElementNodes } = require('@volar/vue-language-core')
const { camelCase } = require('scule')
const { parse } = require('json5')

const unwrapCss = cssFunction => cssFunction.replace('css(', '').replace(')')

/** @type {import('@volar/vue-language-core').VueLanguagePlugin} */
const plugin = _ => ({
  resolveEmbeddedFile (fileName, sfc, embeddedFile) {
    if (embeddedFile.fileName.replace(fileName, '').match(/^\.(js|ts|jsx|tsx)$/)) {
      // $dt helpers
      const dtRegex = /\$dt\('(.*?)'\)/g
      embeddedFile.codeGen.addText('\ndeclare const $dt: import(\'@nuxtjs/design-tokens\').DtFunctionType\n')
      const addDt = (match, dtKey, index) => {
        embeddedFile.codeGen.addText(`\nconst __VLS_$dt_${camelCase(dtKey)}_${index} = `)
        embeddedFile.codeGen.addCode2(
          match,
          index,
          {
            vueTag: 'template',
            vueTagIndex: index,
            capabilities: {
              basic: true,
              references: true,
              definitions: true,
              diagnostic: true,
              rename: true,
              completion: true,
              semanticTokens: true
            }
          }
        )
        embeddedFile.codeGen.addText('\n')
      }

      // Add TemplateTags typings to autocomplete root in `css()`
      const templateTags = {}
      walkElementNodes(
        sfc.templateAst,
        ({ tag }) => {
          templateTags[tag] = true
        }
      )

      embeddedFile.codeGen.addText(`type ComponentTemplateTags__VLS = {\n${Object.entries(templateTags).map(
          ([tag]) => {
            return `  /**
   * The \`<${tag}>\` tag from the Vue template.
   */
  ${tag}: true,\n`
          }
        ).join('')}
}\n`)

      // $variantProps()
      embeddedFile.codeGen.addText('\ndeclare const $variantsProps: (key: keyof ComponentTemplateTags__VLS) => {}\n')

      const templateDtMatches = sfc.template.content.match(dtRegex)
      if (templateDtMatches) {
        sfc.template.content.replace(
          dtRegex,
          (match, dtKey, index) => addDt(match, dtKey, index)
        )
      }

      // Grab `css()` function and type it.
      for (let i = 0; i < sfc.styles.length; i++) {
        const style = sfc.styles[i]
        const cssMatches = style.content.match(/css\(([\s\S]*)\)/)
        const dtMatches = style.content.match(dtRegex)

        if (cssMatches) {
          embeddedFile.codeGen.addText('declare const css: (declaration: import(\'@nuxtjs/design-tokens\').CSS<ComponentTemplateTags__VLS, import(\'@nuxtjs/design-tokens\').NuxtStyleTheme>) => any')
          try {
            const css = unwrapCss(cssMatches[0])
            const cssDeclaration = parse(css)
            console.log({ cssDeclaration, css })
            embeddedFile.codeGen.addText(`/* ${JSON.stringify(cssDeclaration)} */\n`)
          } catch (e) {}
          embeddedFile.codeGen.addText('\nconst __VLS_css = ')
          embeddedFile.codeGen.addCode2(
            cssMatches[0],
            cssMatches.index,
            {
              vueTag: 'style',
              vueTagIndex: i,
              capabilities: {
                basic: true,
                references: true,
                definitions: true,
                diagnostic: true,
                rename: true,
                completion: true,
                semanticTokens: true
              }
            }
          )
          embeddedFile.codeGen.addText('\n')
        }

        if (dtMatches) {
          style.content.replace(
            dtRegex,
            (match, dtKey, index) => addDt(match, dtKey, index)
          )
        }
      }
    }
  }
})
module.exports = plugin
