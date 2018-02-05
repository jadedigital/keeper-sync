<template>
  <q-layout ref="childLayout" view="hHh lpr fFf" class="settings-layout">
    <q-toolbar slot="header">
      <q-btn flat>
        <q-icon @click="$router.go(-1)" name="arrow_back" />
      </q-btn>
      <q-toolbar-title>
        Settings
      </q-toolbar-title>
    </q-toolbar>
  </q-layout>
</template>

<script>
import {
  QLayout,
  QToolbar,
  QBtn,
  QIcon,
  QToolbarTitle
} from 'quasar'

export default {
  name: 'matchup',
  components: {
    QLayout,
    QToolbar,
    QBtn,
    QIcon,
    QToolbarTitle
  },
  data () {
    return {
      response: null
    }
  },
  methods: {
    refresher (done) {
      done()
    }
  }
}
</script>

<style lang="stylus">
.layout.settings-layout
  background-color #fff
</style>
