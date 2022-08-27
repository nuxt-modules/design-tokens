import { defineEventHandler, isMethod, useBody } from 'h3'
// @ts-ignore
import { useStorage, useRuntimeConfig } from '#imports'

export default defineEventHandler(async (event) => {
  const storage = useStorage()
  const runtimeConfig = useRuntimeConfig()
  const { server } = runtimeConfig?.style || {}

  if (server && isMethod(event, 'POST')) {
    try {
      const { tokens } = await useBody(event)

      if (tokens) {
        await storage.setItem('cache:design-tokens:tokens.json', tokens)
        await $fetch('/api/_design-tokens/tokens/generate')
      }
    } catch (_) {}
  }

  return await storage.getItem('cache:design-tokens:tokens.json')
})
