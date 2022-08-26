<script setup lang="ts">
defineProps({
  ...$variantProps('block')
})
</script>

<template>
  <button :class="['block', ...variants]">
    {{ variants[0] }}
  </button>
</template>

<style scoped lang="ts">
css({
  button: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '16px',
    width: '320px',
    height: '320px',
    border: '4px solid {colors.black}',
    '&:hover': {
      border: '4px solid {colors.velvet}'
    },
    variants: {
      primary: {
        backgroundColor: '{colors.primary.500}'
      },
      black: {
        backgroundColor: '{colors.black}'
      },
      lavender: {
        backgroundColor: '{colors.lavender}'
      },
      lila: {
        backgroundColor: '{colors.lila}'
      },
      velvet: {
        backgroundColor: '{colors.velvet}'
      },
      grape: {
        backgroundColor: '{colors.grape}'
      },
      rounded: {
        borderRadius: '50%'
      },
      padded: {
        padding: '4rem'
      }
    }
  }
})
</style>

<style scoped lang="postcss">
button {
  background-color: $dt('');
}
</style>
