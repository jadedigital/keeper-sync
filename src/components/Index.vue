<template>
  <q-layout ref="layout" view="hHh Lpr lFf" :left-class="{'bg-grey-2': true}">
    <q-toolbar class="bg-gradient" slot="header">
      <q-btn class="desktop-only" flat @click="$refs.layout.toggleLeft()">
        <q-icon name="search" />
      </q-btn>

      <q-toolbar-title>
        {{this.teamLookup[myTeam].name}}
        <span slot="subtitle">
          {{this.league.name}}
        </span>
      </q-toolbar-title>
      <q-btn flat @click="toggleModal">
        <q-icon name="search" />
      </q-btn>
    </q-toolbar>
    <q-modal class="search-modal" @open="$refs.search.focus()" v-model="modal">
      <q-search :debounce="0" color="primary" v-model="playerSearch" placeholder="Search" stack-label="Search All Players" ref="search">
      </q-search>
      <div v-if="!playerSearch"class="row flex-center"><i class="info">Start typing to search</i></div>
      <q-btn outline color="primary" @click="toggleModal">Cancel</q-btn>
    </q-modal>
    <!--
      Replace following <div> with
      <router-view /> component
      if using subRoutes
    -->
    <keep-alive>
      <router-view class="child-view"></router-view>
    </keep-alive>

    <q-tabs slot="footer" inverted class="bg-white">
      <!-- Tabs - notice slot="title" -->
      <q-tab @click="changeTab('team')" :class="((activeTab === 'team') ? 'active' : '')" default slot="title" name="tab-1" icon="list" label="My Team" />
      <q-tab @click="changeTab('league')" :class="((activeTab === 'league') ? 'active' : '')" slot="title" name="tab-2" icon="star" label="League" />
      <div slot="title" class="main-avatar q-tab column flex-center relative-position active icon-and-label"><img :src="teamLookup[myTeam].icon" class="q-item-avatar"></div>
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
  QModal,
  QAutocomplete,
  QSearch,
  QFixedPosition,
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
    QTabPane,
    QAutocomplete,
    QSearch,
    QFixedPosition,
    QModal
  },
  data () {
    return {
      response: null,
      activeTab: '',
      modal: false,
      playerSearch: ''
    }
  },
  beforeRouteUpdate (to, from, next) {
    console.log('this works')
    var totalSeconds = ''
    this.nflSchedule.matchup.forEach(el => {
      totalSeconds = totalSeconds + el.gameSecondsRemaining
    })
    if (totalSeconds === 0) {
      var week = this.nflSchedule.week + 1
      this.fetchData(week)
    }
    next()
  },
  computed: {
    ...mapGetters({
      activeLeague: 'activeLeague',
      leagueData: 'leagueData',
      league: 'league',
      players: 'players',
      currentWeek: 'currentWeek',
      nflSchedule: 'nflSchedule'
    }),
    myTeam () {
      var team = this.leagueData[this.activeLeague].teamId
      return team
    },
    teamLookup () {
      var array = this.league.franchises.franchise
      return this.lookup(array, 'id')
    },
    playerLookup () {
      var array = []
      var player = this.playerSearch
      this.players.player.forEach(el => {
        if (el.name.includes(player)) {
          array.push(el.name)
        }
      })
      return array
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
    toggleModal () {
      this.$refs.search.clear()
      this.modal = !this.modal
    },
    lookup (array, id) {
      var lookup = {}
      for (var i = 0, len = array.length; i < len; i++) {
        lookup[array[i][id]] = array[i]
      }
      return lookup
    },
    fetchData (week) {
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
      var nflScheduleParams = {}
      if (week) {
        nflScheduleParams = {
          cookie: data[leagueId].cookie,
          host: data[leagueId].host,
          TYPE: 'nflSchedule',
          W: week,
          JSON: 1
        }
      }
      else {
        nflScheduleParams = {
          cookie: data[leagueId].cookie,
          host: data[leagueId].host,
          TYPE: 'nflSchedule',
          JSON: 1
        }
      }

      var liveScoringParams = {
        cookie: data[leagueId].cookie,
        host: data[leagueId].host,
        TYPE: 'liveScoring',
        L: leagueId,
        DETAILS: 1,
        JSON: 1
      }
      var pointsAllowedParams = {
        cookie: data[leagueId].cookie,
        host: data[leagueId].host,
        TYPE: 'pointsAllowed',
        L: leagueId,
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
      this.callApi(pointsAllowedParams)
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
  color #3f51b5
.bg-gradient
  background linear-gradient(141deg, #3f51b5 15%, #03a9f4 100%)
.search-modal .info
  font-size 120%
  font-weight 300
  margin 20px
.search-modal .q-btn
  margin 20px
  width 90%
.search-modal.fullscreen
  top 50px
.main-avatar
  height 46px
  width 46px
.fade-enter-active, .fade-leave-active {
  transition: opacity .5s ease;
}
.fade-enter, .fade-leave-active {
  opacity: 0
}
.child-view {
  transition: all .5s cubic-bezier(.55,0,.1,1);
}
.slide-left-enter, .slide-right-leave-active {
  opacity: 0;
  -webkit-transform: translate(30px, 0);
  transform: translate(30px, 0);
}
.slide-left-leave-active, .slide-right-enter {
  opacity: 0;
  -webkit-transform: translate(-30px, 0);
  transform: translate(-30px, 0);
}
</style>
