<template>
  <q-layout ref="childLayout" view="hHh lpr fff" class="team-layout">
    <q-toolbar slot="header">
      <q-btn flat>
        <q-icon @click="goBack" name="arrow_back" />
      </q-btn>

      <q-toolbar-title>
        {{teamLookup[thisTeam].name}}
        <span slot="subtitle">
          {{league.name}}
        </span>
      </q-toolbar-title>
    </q-toolbar>
    <q-pull-to-refresh :handler="refresher">
      <div class="contain-main">
        <q-card class="compact-card bg-white">
          <div class="card-main bg-white">
            <q-item separator>
              <q-item-side v-if="teamLookup[thisTeam].icon" :avatar="teamLookup[thisTeam].icon"/>
              <q-item-side v-else :avatar="'./statics/avatar.jpg'"/>
              <q-item-main :label="teamLookup[thisTeam].name" :sublabel="teamLookup[thisTeam].owner_name" />
            </q-item>
          </div>
        </q-card>
        <div style="height: calc(100vh - 50px); background-color: #fff;"> 
          <b-team v-if="dataLoaded"/>
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
  QList,
  QListHeader,
  QItem,
  QItemSide,
  QItemMain,
  QItemSeparator,
  QRouteTab,
  QTabs,
  QTab,
  QTabPane,
  QCard,
  QPullToRefresh,
  QCardTitle,
  QCardSeparator,
  QToolbar,
  QToolbarTitle,
  QSearch,
  QIcon,
  QModal,
  QModalLayout,
  QFab,
  QFabAction,
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
    QList,
    QListHeader,
    QItem,
    QItemSide,
    QItemMain,
    QItemSeparator,
    QRouteTab,
    QTabs,
    QTab,
    QTabPane,
    QPullToRefresh,
    QCard,
    QCardTitle,
    QCardSeparator,
    QToolbar,
    QToolbarTitle,
    QSearch,
    QIcon,
    QModal,
    QModalLayout,
    QFab,
    QFabAction,
    QSpinner,
    bTeam
  },
  data () {
    return {
      response: null,
      dataLoaded: false,
      newWeek: '',
      modalPlayer: '',
      search: '',
      data: false,
      team: ''
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
    thisTeam () {
      var team = this.displayTeam
      return team
    },
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
    goPlayerModal (id) {
      this.$store.commit('SET_DATA', {type: 'modalPlayer', data: id})
      this.$store.commit('TOGGLE_DATA', 'modalPlayerToggle')
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
    unsetTeam () {
      this.dataLoaded = false
    },
    refresher (done) {
      callApi()
      done()
    }
  },
  activated () {
    this.dataLoaded = false
    if (this.displayTeam !== this.team) {
      setTimeout(this.setTeam, 500)
    }
    else {
      this.dataLoaded = true
    }
    this.team = this.displayTeam
  }
}
</script>
