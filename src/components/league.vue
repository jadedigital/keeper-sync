<template>
  <q-pull-to-refresh :handler="refresher">
    <q-tabs inverted class="secondary-tabs">
      <!-- Tabs - notice slot="title" -->
      <q-tab default slot="title" name="tab-1" label="Standings" />
      <q-tab slot="title" name="tab-2" label="Transactions"/>
      <q-tab slot="title" name="tab-3" label="Messages"/>
      <!-- Targets -->
      <q-tab-pane class="no-pad no-border" name="tab-1">
        <q-list highlight class="bg-grey-2 no-border">
          <div v-for="(division, key) in league.divisions.division" :key="division.id" >
            <q-card class="bg-white">
              <q-list-header>{{division.name}}</q-list-header>
              <q-item v-for="(team, key) in leagueStandings.franchise" :key="team.id" v-if="teamLookup[team.id].division === division.id">
                <q-item-side v-if="teamLookup[team.id].icon" :avatar="teamLookup[team.id].icon"/>
                <q-item-side v-else :avatar="'./statics/avatar.jpg'"/>
                <q-item-main :label="teamLookup[team.id].name" :sublabel="teamLookup[team.id].owner_name + ' | ' + team.h2hw + '-' + team.h2hl" />
                <q-item-side right icon="swap_vert" />
              </q-item>
            </q-card>
          </div>
        </q-list>
      </q-tab-pane>
      <q-tab-pane name="tab-2">Transactions</q-tab-pane>
      <q-tab-pane name="tab-3">Message Board</q-tab-pane>
    </q-tabs>
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
  QPullToRefresh,
  QCard,
  QTabs,
  QTab
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
    QPullToRefresh,
    QCard,
    QTabs,
    QTab
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
