<script setup lang="ts">
defineProps({
  variants: {
    type: Array,
    default: () => []
  }
})
</script>

<template>
  <button :class="[...variants]">
    <p>
      {{ variants[0] }}
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
    '&:hover': {
      border: '4px solid {colors.velvet}'
    },
    '& > p': {
      color: '{colors.primary}',
      fontSize: '24px'
    },
    variants: {
      primary: {
        backgroundColor: '{colors.primary.900}',
        '&.rounded': {
          'border-radius': '64px',
          'borderColor': 'red'
        }
      },
      black: {
        backgroundColor: '{colors.black}',
        '&.rounded': {
          'border-radius': '32px',
          'borderColor': 'blue'
        }
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
