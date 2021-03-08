<template>
  <a @click="$emit('click')" class="corner-button">
    <span><slot></slot></span>
  </a>
</template>

<script>
export default {
  name: 'VueButton',
  methods: {
    buttonEnter(event) {
      console.log('ENTER', event)
    },
    buttonLeave(event) {
      console.log('LEAVE', event)
    },
  }
}
</script>

<style lang="scss" scoped>
  @mixin colorize($main-color) {
    &.underlined-a {
      box-shadow: inset 0 -0.2em 0 $main-color;
      &:hover {
        box-shadow: inset 0 -2em 0 $main-color;
      }
    }

    border: 0.2em solid lighten($main-color, 10%);
    color: $main-color;

    &:hover {
      border: 0.2em solid $main-color;
    }

    &:active {
      color: darken($main-color, 20%);
      border: 0.2em solid $main-color;

      -webkit-touch-callout: none; /* iOS Safari */
      -webkit-user-select: none; /* Safari */
      -khtml-user-select: none; /* Konqueror HTML */
      -moz-user-select: none; /* Old versions of Firefox */
      -ms-user-select: none; /* Internet Explorer/Edge */
      user-select: none; /* Non-prefixed version, currently */
    }
  }

  .corner-button {
    @include colorize(#222);
    &.is-primary-dark {
      @include colorize(#1257e0)
    } &.is-primary {
      @include colorize(#417aeb)
    } &.is-gold {
      @include colorize(#fbad2e)
    } &.is-dividend {
      @include colorize(#966b4e)
    } &.is-danger {
      @include colorize(#e84444)
    }

    &.small {
      font-size: 1rem;
    }

    background: white;

    &.underlined-a {
      text-decoration: none;
      padding-bottom: 0.15em;
      box-sizing: border-box;
      transition: 0.2s;

      &:hover {
        color: white;
        transition: all 0.45s cubic-bezier(0.86, 0, 0.07, 1);
      }
    }

    position: relative;
    background: none;
    // text-transform: uppercase;
    font-weight: 700;

    text-decoration: none;
    padding: 0.5rem 1rem;

    &::before {
      content: "";
      display: block;
      position: absolute;
      width: 10%;
      background: white;
      height: 0.3rem;
      right: 20%;
      top: -0.3rem;
      transform: skewX(-45deg);
      -webkit-transition: all 0.45s cubic-bezier(0.86, 0, 0.07, 1);
      transition: all 0.45s cubic-bezier(0.86, 0, 0.07, 1);
    }
    &::after {
      content: "";
      display: block;
      position: absolute;
      width: 10%;
      background: white;
      height: 0.3rem;
      left: 20%;
      bottom: -0.25rem;
      transform: skewX(45deg);
      -webkit-transition: all 0.45 cubic-bezier(0.86, 0, 0.07, 1);
      transition: all 0.45s cubic-bezier(0.86, 0, 0.07, 1);
    }

    &:hover {
      &::before {
        right: 80%;
      }
      &::after {
        left: 80%;
      }
    }
  }
</style>