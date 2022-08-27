<template>
  <div>
    Hello World!
  </div>
</template>

<script setup>
const props = defineProps({
  error: Object
})

const error = props.error

console.log(error)
</script>
