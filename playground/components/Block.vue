<script setup lang="ts">
defineProps({
  ...$variantsProps('button')
})
</script>

<template>
  <button :class="{ ...$props }">
    <p>
      {{ $props }}
    </p>
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
    position: 'relative',
    '&:hover': {
      border: '4px solid {colors.velvet}'
    },
    '& > p': {
      fontSize: '24px',
    },
    "@dark": {
      "& > p": {
        color: 'red'
      }
    },
    "@light": {
      "& > p": {
        color: 'blue'
      }
    },
    "@screen:lg": {
      "& > p": {
        border: "2px solid red"
      }
    },
    variants: {
      primary: {
        backgroundColor: '{colors.primary.900}',
      },
      black: {
        backgroundColor: '{colors.black}',
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
      },
    }
  }
})
</style>
