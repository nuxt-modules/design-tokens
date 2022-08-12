import { kebabCase } from 'scule'
import { createUnplugin } from 'unplugin'

const resolveToken = (path: string): string => `var(--${path.split('.').map(key => kebabCase(key)).join('-')})`

export default createUnplugin(() => ({
  name: 'unplugin-nuxt-design-tokens',
  enforce: 'pre',
  transformInclude (id) {
    // Check if the target is a Vue <style> attribute.
    const regex = /\?vue&type=style/
    return regex.test(id)
  },
  transform (code) {
    const regex = /\$dt\('(.*)'\)/g

    if (regex.test(code)) {
      // Find any usage of `$dt('...')` in code and replace it by `var(--...)`
      return code.replace(regex, (_, path) => resolveToken(path))
    }

    return code
  }
}))
