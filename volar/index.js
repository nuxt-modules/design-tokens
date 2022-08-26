/** @type {import('@volar/vue-language-core').VueLanguagePlugin} */
const plugin = (ctx) => {
  return {
    /*
    resolveEmbeddedFile (fileName, sfc, embeddedFile) {
      if (embeddedFile.fileName.replace(fileName, '').match(/^\.(js|ts|jsx|tsx)$/)) {
        for (let i = 0; i < sfc.styles.length; i++) {
          const style = sfc.styles[i]
          const match = style.content.match(/css\(([\s\S]*)\)/)

          if (match) {
            embeddedFile.codeGen.addText('\nconst __VLS_css = ')
            embeddedFile.codeGen.addCode2(
              match[1],
              match.index + 'css('.length,
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
            embeddedFile.codeGen.addText(';\n')
          }
        }
      }
      */
  }
}
module.exports = plugin
