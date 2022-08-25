// import type { Ref } from 'vue'
// import { kebabCase } from 'scule'
// @ts-ignore
// import type { DesignTokensPaths } from '#design-tokens/types'
// @ts-ignore
import { defineNuxtPlugin/* , unref */ } from '#imports'

export default defineNuxtPlugin(() => {
  // const resolveVariableFromPath = (path: DesignTokensPaths | Ref<DesignTokensPaths>): string => `var(--${unref(path).split('.').map(key => kebabCase(key)).join('-')})`

  return {
    /*
    provide: {
      tokens: resolveVariableFromPath,
      dt: resolveVariableFromPath
    }
    */
  }
})
