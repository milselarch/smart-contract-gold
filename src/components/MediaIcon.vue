<template>
  <a :href="url" target=”_blank”>
    <font-awesome-icon 
      :icon="['fab', icon]" 
      size="is-medium" id="icon"
    />
  </a>
</template>

<script>
export default {
  name: 'media-icon',
  props: ['icon', 'url']
}
</script>

<style lang="scss">
@import "../assets/vars.scss";

#icon {
  text-decoration: none;
  display: inline-block;
  cursor: pointer;
  color: #444;

  &:hover {
    color: $primary;
  }

  &:active {
    color: $primary-dark;
  }
}
</style>