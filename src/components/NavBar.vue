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

    <template slot="end">
        <b-navbar-item class="template-end" tag="div">
            <media-icon
              icon='telegram'
            />

            <font-awesome-icon 
                :icon="['fab', 'discord']" 
                size="is-medium"
            />
        </b-navbar-item>
    </template>

  </b-navbar>

</template>

<script>
import MediaIcon from './MediaIcon'

export default {
  name: 'NavBar',
  components: {
    MediaIcon
  }
}
</script>

<style lang="scss">
#navbar {
  padding: 2rem;

  & .template-end * {
    margin-right: 0.5rem;
  }
  & .template-end *:last-child {
    margin-right: 0rem;
  }
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