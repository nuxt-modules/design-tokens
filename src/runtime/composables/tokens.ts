import type { NuxtDesignTokens } from '../../index'
import { useNuxtApp } from '#imports'

export const useTokens = () => {
  const { $tokens } = useNuxtApp()

  return {
    $tokens,
    $dt: $tokens,
    fetch: async (): Promise<NuxtDesignTokens> => await $fetch('/api/_design-tokens/tokens')
  }
}
