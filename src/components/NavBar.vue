<template>

  <b-navbar id="navbar">
    <template slot="brand">
    </template>

    <template slot="start">
        <b-navbar-item href="#">
            Home
        </b-navbar-item>
        <b-navbar-item href="#">
            Documentation
        </b-navbar-item>
        <b-navbar-dropdown label="Info">
            <b-navbar-item href="#">
                About
            </b-navbar-item>
            <b-navbar-item href="#">
                Contact
            </b-navbar-item>
        </b-navbar-dropdown>
    </template>

    <template class="end" slot="end">
      <button
        class="button is-info is-light social-media"
        slot="trigger"
      >
        <b-icon
          pack="fab"
          icon="telegram"
          size="is-small">
        </b-icon>
      </button>

      <button
        class="button is-info is-light social-media"
        slot="trigger"
      >
        <b-icon
          pack="fab"
          icon="discord"
          size="is-small">
        </b-icon>
      </button>
    </template>

  </b-navbar>

</template>

<script>
export default {
  name: 'NavBar'
}
</script>

<style lang="scss">
#navbar {
  padding: 2rem;
}

.end {
  & * {
    margin-right: 1rem;
  }
  &:nth-last-child(1) {
    margin-right: 0rem;
  }
}
</style>