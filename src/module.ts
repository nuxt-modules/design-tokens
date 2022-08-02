import { performance } from 'perf_hooks'
import {
  defineNuxtModule,
  createResolver,
  resolveModule,
  addPlugin,
  addAutoImport
} from '@nuxt/kit'
import { withTrailingSlash } from 'ufo'
import type { ViteDevServer } from 'vite'
import { defu } from 'defu'
import type { Nitro } from 'nitropack'
import { join } from 'pathe'
import { generateTokens } from './generate'
import { logger, name, version, NuxtLayer, resolveTokens, MODULE_DEFAULTS, createTokensDir } from './utils'
import type { NuxtDesignTokens, ModuleOptions } from './index'

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name,
    version,
    configKey: 'designTokens',
    compatibility: {
      nuxt: '^3.0.0-rc.5'
    }
  },
  defaults: MODULE_DEFAULTS,
  async setup (moduleOptions, nuxt) {
    // Private runtime config
    nuxt.options.runtimeConfig.designTokens = {
      tokensFilePaths: [],
      server: moduleOptions.server
    }

    // Nuxt `extends` key layers
    const layers = nuxt.options._layers

    const privateConfig = nuxt.options.runtimeConfig.designTokens

    // `.nuxt/tokens` resolver
    const tokensDir = withTrailingSlash(nuxt.options.buildDir + '/tokens')

    // Set srcDir for external imports
    globalThis.__nuxtDesignTokensBuildDir__ = tokensDir

    // Tokens dir resolver
    const { resolve: resolveTokensDir } = createResolver(tokensDir)
    privateConfig.tokensDir = tokensDir

    // `runtime/` resolver
    const { resolve: resolveRuntime } = createResolver(import.meta.url)
    const resolveRuntimeModule = (path: string) => resolveModule(path, { paths: resolveRuntime('./runtime') })

    // Init directory on first module run
    await createTokensDir(tokensDir)

    // Refresh configurations
    const refreshTokens = async (nitro?: Nitro) => {
      // Resolve tokens.config configuration from every layer
      const { tokensFilePaths, tokens } = resolveTokens(layers as NuxtLayer[])

      if (moduleOptions.tokens) { privateConfig.tokensFilePaths = tokensFilePaths }

      if (nitro) {
        await nitro.storage.setItem('cache:design-tokens:tokens.json', tokens)
      }

      return { tokens, tokensFilePaths }
    }

    // Main function to build tokens (module-level)
    const buildTokens = async (nitro: Nitro) => {
      try {
        const start = performance.now()
        const tokens = await nitro.storage.getItem('cache:design-tokens:tokens.json') as NuxtDesignTokens
        await generateTokens(tokens, tokensDir)
        const end = performance.now()
        const ms = Math.round(end - start)
        logger.success(`Design Tokens built${ms ? ' in ' + ms + 'ms' : ''}`)
      } catch (e) {
        logger.error('Could not build tokens!')
        logger.error(e.message)
      }
    }

    // Initial tokens resolving
    const { tokens } = await refreshTokens()

    // Transpile
    nuxt.options.build.transpile = nuxt.options.build.transpile || []
    nuxt.options.build.transpile.push(resolveRuntime('./runtime'))

    // Apply aliases
    nuxt.options.alias = nuxt.options.alias || {}
    nuxt.options.alias['#design-tokens'] = resolveTokensDir('index')
    nuxt.options.alias['#design-tokens/types'] = resolveTokensDir('types.d')

    // Inject CSS
    nuxt.options.css = nuxt.options.css || []
    nuxt.options.css = [...nuxt.options.css, resolveTokensDir('tokens.css')]

    // Inject typings
    nuxt.hook('prepare:types', (opts) => {
      opts.references.push({ path: resolveTokensDir('types.d.ts') })
    })

    // Initial build
    nuxt.hook('nitro:build:before', async (nitro) => {
      // Grab options on init
      await refreshTokens(nitro)

      // Build initial tokens
      await buildTokens(nitro)
    })

    // Push handlers
    nuxt.hook('nitro:config', (nitroConfig) => {
      nitroConfig.handlers = nitroConfig.handlers || []

      nitroConfig.handlers.push({
        method: 'all',
        route: '/api/_design-tokens/tokens',
        handler: resolveRuntimeModule('./server/api/tokens/index')
      })

      // Pre-render
      nitroConfig.prerender = nitroConfig.prerender || {}
      nitroConfig.prerender.routes = nitroConfig.prerender.routes || []
      nitroConfig.prerender.routes.push('/api/_design-tokens/tokens')

      // Bundled storage
      nitroConfig.bundledStorage = nitroConfig.bundledStorage || []
      nitroConfig.bundledStorage.push('/cache/tokens')
      nitroConfig.bundledStorage.push('/tokens')

      // Opt-in server features (generate from `/api/_design-tokens/tokens/generate`)
      if (privateConfig.server) {
        nitroConfig.handlers.push({
          method: 'get',
          route: '/api/_design-tokens/tokens/generate',
          handler: resolveRuntimeModule('./server/api/tokens/generate')
        })

        // Inlined dependencies
        nitroConfig.externals = defu(typeof nitroConfig.externals === 'object' ? nitroConfig.externals : {}, {
          inline: [
            'lodash',
            'browser-style-dictionary',
            'browser-style-dictionary/lib',
            'browser-style-dictionary/browser',
            // Inline module runtime in Nitro bundle
            resolveRuntime()
          ]
        })

        // Aliases
        nitroConfig.alias['#design-tokens'] = resolveRuntime('./runtime/server/utils')
      }
    })

    /**
     * Runtime
     */

    addPlugin({
      src: resolveRuntimeModule('./plugins/tokens')
    })
    addAutoImport({
      from: resolveRuntimeModule('./composables/tokens'),
      name: 'useTokens',
      as: 'useTokens'
    })

    /**
     * Dev
     */

    if (nuxt.options.dev) {
      nuxt.hook('nitro:init', (nitro) => {
        nuxt.hook('vite:serverCreated', (viteServer: ViteDevServer) => {
          nuxt.hook('builder:watch', async (_, path) => {
            const isTokenFile = path.includes('tokens.config.ts') || path.includes('tokens.config.js')

            if (isTokenFile) {
              const { tokens } = await refreshTokens(nitro)

              viteServer.ws.send({
                type: 'custom',
                event: 'nuxt-design-tokens:update',
                data: {
                  tokens: moduleOptions.tokens ? tokens : {}
                }
              })

              await buildTokens(nitro)
            }
          })
        })
      })
    }

    /**
     * Prod
     */

    nuxt.hook('build:before', async () => await generateTokens(tokens, tokensDir, true))
    await generateTokens(tokens, tokensDir, true)

    // @nuxtjs/tailwindcss support
    // @ts-ignore - Module might not exist
    nuxt.hook('tailwindcss:config', (tailwindConfig) => {
      tailwindConfig.content = tailwindConfig.content ?? []
      tailwindConfig.content.push(join(tokensDir, 'index.ts'))
    })
  }
})
