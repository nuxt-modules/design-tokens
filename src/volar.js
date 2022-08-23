/** @type {import('@volar/vue-language-core').VueLanguagePlugin} */
const plugin = () => {
  return {
    resolveEmbeddedFile (_, __, embeddedFile) {
      embeddedFile.codeGen.addText(
`interface __VLS_Ctx {
  $dt(key: DesignTokensPaths): string;
}`
      )
    }
  }
}
module.exports = plugin
