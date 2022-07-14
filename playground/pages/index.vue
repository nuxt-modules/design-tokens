<template>
  <div
    class="app flex flex-col bg-lila text-lavender relative overflow-y-auto"
  >
    <header class="flex items-center px-8 py-4 sticky top-0 w-full bg-black z-50">
      <span class="font-bold">
        Hello World
      </span>
    </header>

    <div
      class="flex-1 rounded-lg relative z-0 p-8 overflow-y-auto"
    >
      <p class="flex items-center justify-center w-64 h-64 bg-gradient-to-r from-primary-50 to-primary-900 rounded-xl rounded-lg ring-4 ring-black">
        Primary
      </p>
      <p class="flex items-center justify-center w-64 h-64 bg-black rounded-xl mt-8 rounded-lg ring-4 ring-black">
        Black
      </p>
      <p class="flex items-center justify-center w-64 h-64 bg-grape rounded-xl mt-8 rounded-lg ring-4 ring-black">
        Grape
      </p>
      <p class="text-black flex items-center justify-center w-64 h-64 bg-lavender rounded-xl mt-8 rounded-lg ring-4 ring-black">
        Lavender
      </p>
      <p class="flex items-center justify-center w-64 h-64 bg-velvet-500 rounded-xl mt-8 rounded-lg ring-4 ring-black">
        Velvet
      </p>
    </div>

    <footer class="flex justify-between items-center px-8 py-4 sticky top-0 w-full bg-black z-50">
      <span class="font-bold">
        {{ 'Footer' }}
      </span>

      <span class="font-semibold">Built with @nuxtjs/design-tokens</span>
    </footer>
  </div>
</template>

<script setup lang="ts">
const { fetch: fetchTokens, $t } = useTokens()

const { data } = await useAsyncData(fetchTokens)
</script>

<style scoped lang="postcss">
.app {
  height: 100vh;
  width: 100vw;
}
</style>
