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
        <b-navbar-item tag="div">
            <font-awesome-icon 
                :icon="['fab', 'telegram']" 
                size="is-medium"
            />

            <b-dropdown :triggers="['hover']" aria-role="list">
                <button class="button is-info" slot="trigger">
                    <span>Hover me!</span>
                    <b-icon
                        pack="fas"
                        icon="user-secret"
                        size="is-small">
                    </b-icon>
                </button>

                <b-dropdown-item aria-role="listitem">Action</b-dropdown-item>
                <b-dropdown-item aria-role="listitem">Another action</b-dropdown-item>
                <b-dropdown-item aria-role="listitem">Something else</b-dropdown-item>
            </b-dropdown>
        </b-navbar-item>
    </template>
  </b-navbar>

</template>

<script>
export default {
  name: 'NavBar'
}
</script>

<style>
#navbar {
  padding: 2rem;
}
</style>