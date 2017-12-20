<template>
  <q-layout ref="layout" view="hHh Lpr lFf" :left-class="{'bg-grey-2': true}">
    <q-toolbar slot="header" class="bg-indigo">
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

    <div slot="left">
      <!--
        Use <q-side-link> component
        instead of <q-item> for
        internal vue-router navigation
      -->

      <q-list no-border link inset-delimiter>
        <q-list-header>Teams</q-list-header>
        <q-item v-for="(team, key) in teams" :key="team.team_key">
          <q-item-side :avatar="team.team_logos[0].url.replace('/', '')" />
          <q-item-main :label="team.name" :sublabel="team.league" />
        </q-item>
      </q-list>
    </div>

    <!--
      Replace following <div> with
      <router-view /> component
      if using subRoutes
    -->
    <router-view />

    <q-tabs slot="footer" inverted class="bg-white">
      <!-- Tabs - notice slot="title" -->
      <div @click="showAS()" slot="title" class="q-tab column flex-center relative-position active icon-and-label"><img :src="activeTeamIcon" class="q-item-avatar"></div>
      <q-route-tab default to="team" slot="title" name="tab-1" icon="list" label="My Team" />
      <q-route-tab to="league" slot="title" name="tab-2" icon="star" label="League" />
      <q-route-tab to="draft" slot="title" name="tab-3" icon="view_comfy" label="Draft"/>
      <q-route-tab to="players" slot="title" name="tab-4" icon="person" label="Players" />
    </q-tabs>
  </q-layout>
</template>

<script>
import {
  openURL,
  ActionSheet,
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
  QRouteTab,
  QTabPane,
  LocalStorage,
  Loading
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
    QRouteTab,
    QTabPane
  },
  data () {
    return {
      response: null
    }
  },
  computed: {
    ...mapGetters({
      activeTeam: 'activeTeam',
      leagueData: 'leagueData',
      rosters: 'rosters',
      players: 'players',
      leagueStandings: 'leagueStandings',
      league: 'league'
    }),
    teams () {
      let teams = LocalStorage.get.item('teams')
      return teams
    },
    activeTeamIcon () {
      var icon = ''
      var this_ = this
      if (this.teams) {
        this.teams.forEach(function (el) {
          if (el.team_key === this_.activeTeam) {
            icon = el.team_logos[0].url.replace('/', '')
          }
        })
      }
      return icon
    }
  },
  methods: {
    launch (url) {
      close()
      openURL(url, '_self')
    },
    showAS () {
      var actions = []
      var this_ = this
      this.teams.forEach(function (el) {
        var action = {
          label: el.name + ' (' + el.league + ')',
          avatar: el.team_logos[0].url.replace('/', ''),
          handler () {
            var teamId = '.t.' + el.team_id
            var teamPayload = el.team_key
            var leaguePayload = teamPayload.replace(teamId, '')
            this_.$store.commit('CHANGE_ACTIVE_TEAM', teamPayload)
            this_.$store.commit('CHANGE_ACTIVE_LEAGUE', leaguePayload)
          }
        }
        actions.push(action)
      })
      ActionSheet.create({
        title: 'Select League',
        actions: actions,
        dismiss: {
          label: 'Cancel',
          handler () {
            Toast.create('Cancelled...')
          }
        }
      })
    },
    fetchData (requestParams) {
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
              Loading.hide()
              Toast.create("Can't fetch " + requestParams.TYPE + ' data')
            }
          })
      }
    }
  },
  mounted () {
    this.$nextTick(() => {
      if (!this.leagueData || !this.rosters || !this.players || !this.leagueStandings || !this.league) {
        Loading.show({
          delay: 0
        })
        console.log('test')
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
        this.fetchData(rosterParams)
        this.fetchData(playerParams)
        this.fetchData(leagueParams)
        this.fetchData(standingsParams)
        this.fetchData(freeAgentsParams)
        this.fetchData(projectedScoresParams)
        this.fetchData(topAddsParams)
        this.fetchData(topOwnsParams)
        Loading.hide()
      }
      this.$router.push('/team')
    })
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
</style>
