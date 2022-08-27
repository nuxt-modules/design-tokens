import type { NuxtThemeTokens } from '../../index'
import { useNuxtApp } from '#imports'

export const useTokens = () => {
  const { $tokens } = useNuxtApp()

  return {
    $tokens,
    $dt: $tokens,
    fetch: async (): Promise<NuxtThemeTokens> => await $fetch('/api/_design-tokens/tokens')
  }
}
