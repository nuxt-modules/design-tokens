import { defineEventHandler } from 'h3'
// @ts-ignore
import { generateTokens } from '#design-tokens'
// @ts-ignore
import { useRuntimeConfig, useStorage } from '#imports'

export default defineEventHandler(async () => {
  const runtimeConfig = useRuntimeConfig()

  const { tokensDir } = runtimeConfig?.style

  const storage = useStorage()

  const tokens = await storage.getItem('cache:design-tokens:tokens.json')

  await generateTokens(tokens, tokensDir)
})
