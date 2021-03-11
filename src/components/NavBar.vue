<template>

  <b-navbar id="navbar">
    <template slot="brand">
    </template>

    <template slot="start">
        <!--
        <b-navbar-item href="#">
            Home
        </b-navbar-item>
        -->

        <b-navbar-dropdown label="Info">
          <b-navbar-item
            href="https://docs.binancegold.io/" target="_blank"
          >
              Documentation
          </b-navbar-item>

          <b-navbar-item
            href="https://bscscan.com/address/0x66cB2D528A3380Bd919245D8812b45B03D421Ce5" target="_blank"
          >
              View Smart Contract
          </b-navbar-item>
        </b-navbar-dropdown>
    </template>

    <template slot="end">
      <b-navbar-item class="template-end" tag="div">
        <media-icon
          icon='telegram'
          url='https://t.me/gandhijiio'
        />

        <media-icon
          icon='discord'
          url='https://discord.gg/2JYfAvm'
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
  padding-bottom: 0px;

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