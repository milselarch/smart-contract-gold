<template>
  <font-awesome-icon 
    :icon="['fab', icon]" 
    size="is-medium"
  />
</template>

<script>
export default {
  name: 'media-icon',
  props: ['icon']
}
</script>