import { fileURLToPath } from 'url'
import { describe, test, expect } from 'vitest'
import { $fetch, setup } from '@nuxt/test-utils'
import { generateTokens } from '../src/runtime/server/utils'

const fixturePath = fileURLToPath(new URL('./fixtures/basic', import.meta.url))

describe('Basic usage', async () => {
  await setup({
    rootDir: fixturePath,
    server: true,
    dev: true
  })

  await generateTokens(
    {
      colors: {
        red: {
          value: 100
        }
      }
    },
    fixturePath + '/.nuxt/tokens/'
  )

  test('Fetch index', async () => {
    const content = await $fetch('/')

    // Normal Prop
    expect(content).includes('Hello World')
  })
})
