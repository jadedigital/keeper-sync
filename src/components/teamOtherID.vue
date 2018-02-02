<template>
  <q-layout ref="childLayout" view="hHh lpr fff" class="team-layout">
    <q-toolbar slot="header">
      <q-btn flat>
        <q-icon @click="goBack" name="arrow_back" />
      </q-btn>

      <q-toolbar-title>
        {{thisTeam ? teamLookup[thisTeam].name : ''}}
        <span slot="subtitle">
          {{league.name}}
        </span>
      </q-toolbar-title>
    </q-toolbar>
    <q-pull-to-refresh :handler="refresher">
      <div class="contain-main">
        <q-card class="compact-card bg-white">
          <div class="card-main bg-white">
            <q-item v-if="thisTeam" separator>
              <q-item-side v-if="teamLookup[thisTeam].icon" :avatar="teamLookup[thisTeam].icon"/>
              <q-item-side v-else :avatar="'./statics/avatar.jpg'"/>
              <q-item-main :label="teamLookup[thisTeam].name" :sublabel="teamLookup[thisTeam].owner_name" />
            </q-item>
          </div>
        </q-card>
        <div style="height: calc(100vh - 50px); background-color: #fff;"> 
          <b-team v-if="dataLoaded && thisTeam" :thisTeam="thisTeam"/>
          <q-spinner 
            v-if="!dataLoaded" 
            color="secondary" 
            size="40px" 
            class="absolute-center" 
            style="margin-left: -20px;"
          />
        </div>
      </div>
    </q-pull-to-refresh>
  </q-layout>
</template>

<script>
import {
  QLayout,
  QBtn,
  QToolbar,
  QToolbarTitle,
  QIcon,
  QPullToRefresh,
  QCard,
  QItem,
  QItemSide,
  QItemMain,
  QSpinner
} from 'quasar'
import { mapGetters } from 'vuex'
import { callApi } from '../data'
import bTeam from './bTeam.vue'

export default {
  name: 'teams',
  components: {
    QLayout,
    QBtn,
    QToolbar,
    QToolbarTitle,
    QIcon,
    QPullToRefresh,
    QCard,
    QItem,
    QItemSide,
    QItemMain,
    QSpinner,
    bTeam
  },
  data () {
    return {
      response: null,
      dataLoaded: false,
      thisTeam: '',
      lastTeam: ''
    }
  },
  computed: {
    ...mapGetters({
      activeLeague: 'activeLeague',
      leagueData: 'leagueData',
      rosters: 'rosters',
      players: 'players',
      league: 'league',
      displayTeam: 'displayTeam'
    }),
    teamLookup () {
      var array = this.league.franchises.franchise
      return this.lookup(array, 'id')
    }
  },
  methods: {
    goBack () {
      this.$router.go(-1)
    },
    goPlayer (id) {
      this.$router.push('/player/' + id)
    },
    lookup (array, key) {
      var lookup = {}
      for (var i = 0, len = array.length; i < len; i++) {
        lookup[array[i][key]] = array[i]
      }
      return lookup
    },
    setTeam () {
      this.dataLoaded = true
    },
    refresher (done) {
      callApi()
      done()
    }
  },
  activated () {
    this.thisTeam = this.$route.params.id
    if (this.thisTeam !== this.lastTeam) {
      setTimeout(this.setTeam, 700)
    }
    else {
      this.setTeam()
    }
    this.lastTeam = this.$route.params.id
  },
  deactivated () {
    this.dataLoaded = false
  }
}
</script>
