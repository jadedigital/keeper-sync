<template>
  <q-pull-to-refresh :handler="refresher" class="chat-layout">
    Chat
  </q-pull-to-refresh>
</template>

<script>
import {
  QBtn,
  QList,
  QListHeader,
  QItem,
  QItemSide,
  QItemMain,
  QItemTile,
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
  QSearch,
  QIcon
} from 'quasar'
import { mapGetters } from 'vuex'
import { getChats } from '../data'
import bTeam from './bTeam.vue'
import bSpinner from './bSpinner.vue'

export default {
  name: 'team',
  components: {
    QBtn,
    QList,
    QListHeader,
    QItem,
    QItemSide,
    QItemMain,
    QItemTile,
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
    QSearch,
    QIcon,
    bTeam,
    bSpinner
  },
  data () {
    return {
      response: null,
      dataLoaded: false,
      newWeek: '',
      search: ''
    }
  },
  computed: {
    ...mapGetters({
      activeLeague: 'activeLeague',
      leagueData: 'leagueData',
      league: 'league',
      chat: 'chat'
    }),
    myTeam () {
      var team = this.leagueData[this.activeLeague].teamId
      return team
    },
    teamLookup () {
      var array = this.league.franchises.franchise
      return this.lookup(array, 'id')
    }
  },
  methods: {
    lookup (array, key) {
      var lookup = {}
      for (var i = 0, len = array.length; i < len; i++) {
        lookup[array[i][key]] = array[i]
      }
      return lookup
    },
    refresher (done) {
      var host = this.leagueData[this.activeLeague].host
      var cookie = this.leagueData[this.activeLeague].cookie
      var league = this.activeLeague
      getChats(host, league, cookie)
        .then((response) => {
          done()
        })
    },
    fetchData () {
      var host = this.leagueData[this.activeLeague].host
      var cookie = this.leagueData[this.activeLeague].cookie
      var league = this.activeLeague
      getChats(host, league, cookie)
        .then((response) => {
          this.dataLoaded = true
        })
    },
    setTeam () {
      this.dataLoaded = true
    }
  },
  created () {
    setTimeout(this.fetchData, 500)
  }
}
</script>