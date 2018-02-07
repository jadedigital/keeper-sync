<template>
  <q-layout ref="childLayout" view="hHh lpr fFf" class="otherMatchup">
    <q-toolbar slot="header">
      <q-btn flat>
        <q-icon @click="$router.go(-1)" name="arrow_back" />
      </q-btn>
      <q-toolbar-title>
        Matchup
      </q-toolbar-title>
    </q-toolbar>
    <div v-if="!dataLoaded" style="height: calc(100vh - 50px)">
      <q-spinner color="secondary" size="40px" class="absolute-center" style="margin-left: -20px;"/>
    </div>
    <q-pull-to-refresh v-if="dataLoaded" :handler="refresher" class="matchup">
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
  QPullToRefresh,
  QSpinner
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
    QSpinner,
    bMatchup
  },
  data () {
    return {
      dataLoaded: false
    }
  },
  methods: {
    refresher (done) {
      done()
    },
    loadData () {
      this.dataLoaded = true
    }
  },
  activated () {
    setTimeout(this.loadData, 500)
  },
  deactivated () {
    this.dataLoaded = false
  }
}
</script>

<style lang="stylus">
.layout.otherMatchup
  background-color #fff
</style>
