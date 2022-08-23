<template>
  <button :class="['block', ...variants]">
    {{ variants[0] }}
  </button>
</template>

<script setup lang="ts">
defineProps({
  ...$variantProps('block')
})
</script>

<style scoped lang="postcss">
.block {
  @component('block');
}
</style>
