import { defineEventHandler, isMethod, useBody } from 'h3'
// @ts-ignore
import { useStorage, useRuntimeConfig } from '#imports'
// @ts-ignore
import { generateTokens } from '#design-tokens'

export default defineEventHandler(async (event) => {
  const storage = useStorage()
  const runtimeConfig = useRuntimeConfig()
  const { tokensDir } = runtimeConfig?.tokensDir

  if (isMethod(event, 'POST')) {
    try {
      const { tokens } = await useBody(event)

      if (tokens) {
        await storage.setItem('cache:design-tokens:tokens.json', tokens)
        await generateTokens(tokens, tokensDir, true, false)
      }
    } catch (_) {}
  }

  return await storage.getItem('cache:design-tokens:tokens.json')
})
