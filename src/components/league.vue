<template>
  <q-pull-to-refresh :handler="refresher">
    <q-list separator highlight>
      <q-list-header>Standings</q-list-header>
      <q-item v-for="(team, key) in leagueStandings.franchise" :key="team.id">
        <q-item-side v-if="teamLookup[team.id].icon" :avatar="teamLookup[team.id].icon"/>
        <q-item-side v-else :avatar="'./statics/avatar.jpg'"/>
        <q-item-main :label="teamLookup[team.id].name" :sublabel="teamLookup[team.id].owner_name + ' | '" />
        <q-item-side right icon="swap_vert" />
      </q-item>
    </q-list>
  </q-pull-to-refresh >
</template>


<script>
import {
  openURL,
  QBtn,
  QList,
  QListHeader,
  QItem,
  QItemSide,
  QItemMain,
  QItemSeparator,
  QRouteTab,
  QTabPane,
  QPullToRefresh
} from 'quasar'
import { mapGetters } from 'vuex'

export default {
  name: 'index',
  components: {
    QBtn,
    QList,
    QListHeader,
    QItem,
    QItemSide,
    QItemMain,
    QItemSeparator,
    QRouteTab,
    QTabPane,
    QPullToRefresh
  },
  data () {
    return {
      response: null
    }
  },
  computed: {
    ...mapGetters({
      activeLeague: 'activeLeague',
      leagueData: 'leagueData',
      rosters: 'rosters',
      players: 'players',
      leagueStandings: 'leagueStandings',
      league: 'league'
    }),
    teamLookup () {
      var array = this.league.franchises.franchise
      return this.lookup(array)
    }
  },
  watch: {
    activeLeague: function () {
      this.fetchStandings()
    }
  },
  methods: {
    launch (url) {
      close()
      openURL(url, '_self')
    },
    refresher (done) {
      this.fetchStandings()
      done()
    },
    lookup (array) {
      var lookup = {}
      for (var i = 0, len = array.length; i < len; i++) {
        lookup[array[i].id] = array[i]
      }
      return lookup
    },
    fetchStandings () {
      // refresh
    }
  }
}
</script>
