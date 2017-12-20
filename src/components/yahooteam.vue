<template>
  <div>
    <div v-if="!accessToken" class="layout-padding logo-container">
      <q-btn @click="launch('https://keepersync.com/auth/yahoo')">Login with Y!</q-btn>
    </div>
    <q-list v-if="accessToken" highlight>
      <q-list-header>Roster</q-list-header>
      <q-item v-for="(player, key) in rosters[activeTeam]" :key="player.player_key">
        <q-item-side :avatar="player.headshot.url.replace('/', '')" />
        <q-item-main :label="player.name.full" :sublabel="player.editorial_team_abbr + ' - ' + player.display_position" />
        <q-item-side right icon="swap_vert" />
      </q-item>
      <q-item-separator />
      <q-list-header>Taxi Squad</q-list-header>
    </q-list>
  </div>
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
  LocalStorage
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
      activeLeague: 'activeLeague',
      accessToken: 'accessToken'
    }),
    userName () {
      let name = LocalStorage.get.item('displayName')
      return name
    },
    teams () {
      let teams = LocalStorage.get.item('teams')
      return teams
    },
    rosters () {
      let rosters = LocalStorage.get.item('rosters')
      return rosters
    },
    activeTeamIcon () {
      var icon = ''
      var this_ = this
      this.teams.forEach(function (el) {
        if (el.team_key === this_.activeTeam) {
          icon = el.team_logos[0].url.replace('/', '')
        }
      })
      return icon
    }
  },
  methods: {
    launch (url) {
      close()
      openURL(url, '_self')
    }
  },
  mounted () {
    this.$nextTick(() => {
      if (!this.activeTeam) {
        let teams = LocalStorage.get.item('teams')
        let leagues = LocalStorage.get.item('leagues')
        var teamPayload = teams[0].team_key
        var leaguePayload = leagues[0].league_key
        this.$store.commit('CHANGE_ACTIVE_TEAM', teamPayload)
        this.$store.commit('CHANGE_ACTIVE_LEAGUE', leaguePayload)
      }
      if (!this.accessToken) {
        let accessToken = LocalStorage.get.item('accessToken')
        this.$store.commit('SET_ACCESS_TOKEN', accessToken)
      }
    })
  }
}
</script>