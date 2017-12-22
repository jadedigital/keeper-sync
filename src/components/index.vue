<template>
  <q-layout ref="layout" view="hHh Lpr lFf" :left-class="{'bg-grey-2': true}">
    <q-toolbar slot="header">
      <q-btn class="desktop-only" flat @click="$refs.layout.toggleLeft()">
        <q-icon name="menu" />
      </q-btn>

      <q-toolbar-title>
        KeeperSync
        <div slot="subtitle">Running on Quasar v{{$q.version}}</div>
      </q-toolbar-title>
      <q-btn flat>
        <q-icon name="settings" />
      </q-btn>
    </q-toolbar>
    <!--
      Replace following <div> with
      <router-view /> component
      if using subRoutes
    -->
    <router-view />

    <q-tabs slot="footer" inverted class="bg-white">
      <!-- Tabs - notice slot="title" -->
      <div slot="title" class="q-tab column flex-center relative-position active icon-and-label"><img :src="teamLookup[myTeam].icon" class="q-item-avatar"></div>
      <q-tab @click="changeTab('team')" :class="((activeTab === 'team') ? 'active' : '')" default slot="title" name="tab-1" icon="list" label="My Team" />
      <q-tab @click="changeTab('league')" :class="((activeTab === 'league') ? 'active' : '')" slot="title" name="tab-2" icon="star" label="League" />
      <q-tab @click="changeTab('draft')" :class="((activeTab === 'draft') ? 'active' : '')" slot="title" name="tab-3" icon="view_comfy" label="Draft"/>
      <q-tab @click="changeTab('players')" :class="((activeTab === 'players') ? 'active' : '')" slot="title" name="tab-4" icon="person" label="Players" />
    </q-tabs>
  </q-layout>
</template>

<script>
import {
  openURL,
  Toast,
  QLayout,
  QToolbar,
  QToolbarTitle,
  QBtn,
  QIcon,
  QList,
  QListHeader,
  QItem,
  QItemSide,
  QItemMain,
  QItemSeparator,
  QTabs,
  QTab,
  QRouteTab,
  QTabPane,
  LocalStorage
} from 'quasar'
import { mapGetters } from 'vuex'

export default {
  name: 'index',
  components: {
    QLayout,
    QToolbar,
    QToolbarTitle,
    QBtn,
    QIcon,
    QList,
    QListHeader,
    QItem,
    QItemSide,
    QItemSeparator,
    QItemMain,
    QTabs,
    QTab,
    QRouteTab,
    QTabPane
  },
  data () {
    return {
      response: null,
      activeTab: ''
    }
  },
  computed: {
    ...mapGetters({
      activeLeague: 'activeLeague',
      leagueData: 'leagueData',
      league: 'league'
    }),
    myTeam () {
      var team = this.leagueData[this.activeLeague].teamId
      return team
    },
    teamLookup () {
      var array = this.league.franchises.franchise
      return this.lookup(array)
    }
  },
  methods: {
    launch (url) {
      close()
      openURL(url, '_self')
    },
    changeTab (route) {
      this.activeTab = route
      this.$router.push('/' + route)
    },
    lookup (array) {
      var lookup = {}
      for (var i = 0, len = array.length; i < len; i++) {
        lookup[array[i].id] = array[i]
      }
      return lookup
    },
    fetchData () {
      let data = LocalStorage.get.item('leagueData')
      var leagueId = Object.keys(data)[0]
      this.$store.commit('SET_LEAGUE_DATA', data)
      this.$store.commit('CHANGE_ACTIVE_LEAGUE', leagueId)
      var rosterParams = {
        cookie: data[leagueId].cookie,
        host: data[leagueId].host,
        TYPE: 'rosters',
        L: leagueId,
        JSON: 1
      }
      var playerParams = {
        cookie: data[leagueId].cookie,
        host: data[leagueId].host,
        TYPE: 'players',
        DETAILS: 1,
        JSON: 1
      }
      var leagueParams = {
        cookie: data[leagueId].cookie,
        host: data[leagueId].host,
        TYPE: 'league',
        L: leagueId,
        JSON: 1
      }
      var standingsParams = {
        cookie: data[leagueId].cookie,
        host: data[leagueId].host,
        TYPE: 'leagueStandings',
        L: leagueId,
        JSON: 1
      }
      var freeAgentsParams = {
        cookie: data[leagueId].cookie,
        host: data[leagueId].host,
        TYPE: 'freeAgents',
        L: leagueId,
        JSON: 1
      }
      var projectedScoresParams = {
        cookie: data[leagueId].cookie,
        host: data[leagueId].host,
        TYPE: 'projectedScores',
        L: leagueId,
        COUNT: 3000,
        JSON: 1
      }
      var topAddsParams = {
        cookie: data[leagueId].cookie,
        host: data[leagueId].host,
        TYPE: 'topAdds',
        JSON: 1
      }
      var topOwnsParams = {
        cookie: data[leagueId].cookie,
        host: data[leagueId].host,
        TYPE: 'topOwns',
        JSON: 1
      }
      var nflScheduleParams = {
        cookie: data[leagueId].cookie,
        host: data[leagueId].host,
        TYPE: 'nflSchedule',
        W: 16,
        JSON: 1
      }
      var liveScoringParams = {
        cookie: data[leagueId].cookie,
        host: data[leagueId].host,
        TYPE: 'liveScoring',
        L: leagueId,
        DETAILS: 1,
        JSON: 1
      }
      this.callApi(rosterParams)
      this.callApi(playerParams)
      this.callApi(leagueParams)
      this.callApi(standingsParams)
      this.callApi(freeAgentsParams)
      this.callApi(projectedScoresParams)
      this.callApi(topAddsParams)
      this.callApi(topOwnsParams)
      this.callApi(nflScheduleParams)
      this.callApi(liveScoringParams)
    },
    callApi (requestParams) {
      if (LocalStorage.has(requestParams.TYPE)) {
        let localData = LocalStorage.get.item(requestParams.TYPE)
        this.$store.commit('SET_DATA', {type: requestParams.TYPE, data: localData})
      }
      else {
        var url = 'https://keepersync.com/mfl/export'
        this.axios.get(url, {
          params: requestParams
        })
          .then((response) => {
            var responseData = JSON.parse(response.data)
            LocalStorage.set(requestParams.TYPE, responseData[requestParams.TYPE])
            this.$store.commit('SET_DATA', {type: requestParams.TYPE, data: responseData[requestParams.TYPE]})
          })
          .catch((error) => {
            if (error) {
              Toast.create("Can't fetch " + requestParams.TYPE + ' data')
            }
          })
      }
    }
  },
  created () {
    this.fetchData()
  }
}
</script>

<style lang="stylus">
.logo-container
  width 255px
  height 242px
  perspective 800px
  position absolute
  top 50%
  left 50%
  transform translateX(-50%) translateY(-50%)
.logo
  position absolute
  transform-style preserve-3d
.q-tab
  font-size 10px
  padding 0
  min-height 62px
.q-tab.icon-and-label
  padding 0
  min-height 62px
.q-tabs-inverted .q-tabs-scroller
  color #555
.q-tab.active
  color #00BCD4
</style>
