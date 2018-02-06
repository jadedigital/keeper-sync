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
    <q-list no-border link separator sparse>
      <q-item>
        <q-item-side color="primary" icon="mdi-settings" />
        <q-item-main label="General" />
      </q-item>
      <q-item>
        <q-item-side color="primary" icon="mdi-football-helmet" />
        <q-item-main label="Team customization" />
      </q-item>
      <q-item>
        <q-item-side color="primary" icon="mdi-bell" />
        <q-item-main label="Notifications" />
      </q-item>
      <q-item>
        <q-item-side color="primary" icon="mdi-palette" />
        <q-item-main label="Theme customization" />
      </q-item>
    </q-list>
  </q-layout>
</template>

<script>
import {
  QLayout,
  QToolbar,
  QBtn,
  QIcon,
  QList,
  QItem,
  QItemSide,
  QItemMain,
  QToolbarTitle
} from 'quasar'

export default {
  name: 'matchup',
  components: {
    QLayout,
    QToolbar,
    QBtn,
    QIcon,
    QList,
    QItem,
    QItemSide,
    QItemMain,
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
