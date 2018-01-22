<template>
  <q-layout ref="childLayout" view="hHh lpr fFf" class="otherMatchup">
    <q-toolbar class="bg-gradient" slot="header">
      <q-btn flat>
        <q-icon @click="$router.go(-1)" name="arrow_back" />
      </q-btn>
      <q-toolbar-title>
        Matchup
      </q-toolbar-title>
    </q-toolbar>
    <q-pull-to-refresh :handler="refresher" class="matchup">
      <b-matchup/>
    </q-pull-to-refresh>
  </q-layout>
</template>

<script>
import {
  QLayout,
  QToolbar,
  QBtn,
  QIcon,
  QToolbarTitle,
  QPullToRefresh
} from 'quasar'
import bMatchup from './bMatchup.vue'

export default {
  name: 'matchup',
  components: {
    QLayout,
    QToolbar,
    QBtn,
    QIcon,
    QToolbarTitle,
    QPullToRefresh,
    bMatchup
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
.layout.otherMatchup
  background-color #fff
</style>
