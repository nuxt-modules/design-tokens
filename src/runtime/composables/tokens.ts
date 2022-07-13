import type { DesignTokensPaths } from '#tokens/types'
import { useNuxtApp } from '#imports'

export const $tokens = (path: DesignTokensPaths): string => {
  const { $tokens: $t } = useNuxtApp()

  return $t(path)
}
